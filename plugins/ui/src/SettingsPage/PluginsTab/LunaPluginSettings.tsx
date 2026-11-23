import React from "react";
import type { ErrorInfo, ReactNode } from "react";

import { LunaPlugin, unloadSet, type PluginPackage } from "@luna/core";
import { store as obyStore } from "oby";

import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

import { LunaSwitch, LunaTrashButton, SpinningButton } from "../../components";
import { UpdateConfirm } from "../MarketplaceTab/UpdateConfirm";
import { displayName } from "../names";
import { cardSx, pillButton } from "../styles";
import { LiveReloadToggle } from "./LiveReloadToggle";
import { LunaPluginHeader } from "./LunaPluginHeader";

import SettingsIcon from "@mui/icons-material/Settings";
import { grey, red } from "@mui/material/colors";

class PluginSettingsErrorBoundary extends React.Component<{ name: string; children: ReactNode }, { error?: string }> {
	state: { error?: string } = {};
	static getDerivedStateFromError(error: Error) {
		return { error: error.message || String(error) };
	}
	componentDidCatch(error: Error, info: ErrorInfo) {
		console.error(`[Luna] Plugin settings crashed for ${this.props.name}:`, error, info.componentStack);
	}
	render() {
		if (this.state.error) {
			return (
				<Stack spacing={1} sx={{ padding: 1 }}>
					<Typography variant="body2" sx={{ color: red[300] }}>
						Settings crashed: {this.state.error}
					</Typography>
					<Button
						size="small"
						variant="outlined"
						sx={{ alignSelf: "flex-start", color: grey[400], borderColor: grey[700] }}
						onClick={() => this.setState({ error: undefined })}
					>
						Retry
					</Button>
				</Stack>
			);
		}
		return this.props.children;
	}
}

type LunaPluginSettingsProps = {
	plugin: LunaPlugin;
	/** Newer package found by an update check */
	update?: PluginPackage;
	onUpdated?: (url: string) => void;
};

export const LunaPluginSettings = React.memo(({ plugin, update, onUpdated }: LunaPluginSettingsProps) => {
	// Have to wrap in function call as Settings is a functional component
	// A new card can mount before install() finishes enabling the plugin.
	const enabled = React.useSyncExternalStore(plugin.onSetEnabled, () => Boolean(plugin.enabled));
	const subscribeLoading = React.useCallback((notify: () => void) => plugin.loading.onValue(notify), [plugin]);
	const loading = React.useSyncExternalStore(subscribeLoading, () => plugin.loading._);
	const [loadError, setLoadError] = React.useState(plugin.loadError._);
	const [installed, setInstalled] = React.useState(plugin.installed);
	const [hideSettings, setHideSettings] = React.useState(plugin.store.hideSettings);
	const [collapsed, setCollapsed] = React.useState(false);
	const [confirming, setConfirming] = React.useState(false);

	const [pkg, setPackage] = React.useState<PluginPackage>(obyStore.unwrap(plugin.store.package));

	React.useEffect(() => {
		const unloads = new Set([
			plugin.loadError.onValue((next) => setLoadError(next)),
			obyStore.on(
				() => plugin.store.package,
				() => setPackage(obyStore.unwrap(plugin.store.package)),
			),
			obyStore.on(
				() => plugin.installed,
				() => setInstalled(obyStore.unwrap(plugin.store.installed)),
			),
		]);
		return () => {
			unloadSet(unloads);
		};
	}, [plugin]);

	// Memoize callbacks
	const handleReload = React.useCallback(plugin.reload.bind(plugin), [plugin]);
	const toggleEnabled = React.useCallback((_: unknown, checked: boolean) => (checked ? plugin.enable() : plugin.disable()), [plugin]);
	const uninstall = React.useCallback(plugin.uninstall.bind(plugin), [plugin]);

	if (!installed) return null;

	const disabled = !enabled || loading;

	const isDev = plugin.store.url.startsWith("http://127.0.0.1");

	const author = pkg.author;
	const desc = pkg.description;
	const name = pkg.name;
	const link = pkg.homepage ?? pkg.repository?.url;
	let version = isDev ? `${pkg.version ?? ""} [DEV]` : pkg.version;

	// Dont allow disabling core plugins
	const isCore = LunaPlugin.corePlugins.has(name);

	const Settings = plugin.exports?.Settings;
	const hasSettings = Settings !== undefined && Settings !== null;

	return (
		<Stack
			spacing={1}
			data-luna-plugin-card={name}
			sx={{
				...cardSx,
				borderColor: loadError ? "rgba(229, 115, 115, 0.7)" : update ? "rgba(144, 202, 249, 0.6)" : cardSx.borderColor,
				paddingTop: 1.25,
				paddingBottom: hasSettings || hideSettings ? 2 : 1.25,
			}}
		>
			<LunaPluginHeader
				name={isCore ? name : displayName(name)}
				title={name}
				version={version}
				link={link}
				loadError={loadError}
				author={collapsed ? undefined : author}
				desc={collapsed ? undefined : desc}
				children={
					<>
						<IconButton
							color="primary"
							size="small"
							aria-label={`${collapsed ? "Expand" : "Collapse"} ${name}`}
							aria-expanded={!collapsed}
							onClick={() => setCollapsed(!collapsed)}
						>
							{collapsed ? <ExpandMoreIcon /> : <ExpandLessIcon />}
						</IconButton>
						{!collapsed && (
							<>
								{!isCore && (
									<Tooltip
										title={enabled ? `Disable ${name}` : `Enable ${name}`}
										children={<LunaSwitch checked={enabled} loading={loading} onChange={toggleEnabled} />}
									/>
								)}
								<SpinningButton title="Reload plugin" spin={loading} disabled={disabled} onClick={handleReload} />
								<LiveReloadToggle plugin={plugin} disabled={disabled} sx={{ marginLeft: 1 }} />
								<SpinningButton
									title={hideSettings ? "Show settings" : "Hide settings"}
									spin={loading}
									disabled={!enabled || !hasSettings}
									onClick={() => setHideSettings((prev) => (plugin.store.hideSettings = !prev))}
									icon={SettingsIcon}
									sxColor={grey.A400}
								/>
								{/* Don't show uninstall button for core plugins */}
								{!isCore && <LunaTrashButton title="Uninstall plugin" onClick={uninstall} />}
							</>
						)}
					</>
				}
			/>
			{update &&
				(confirming ? (
					<UpdateConfirm
						plugin={plugin}
						update={update}
						onCancel={() => setConfirming(false)}
						onDone={() => {
							setConfirming(false);
							onUpdated?.(plugin.url);
						}}
					/>
				) : (
					<Stack direction="row" sx={{ alignItems: "center", gap: 1, flexWrap: "wrap" }}>
						<Typography variant="body2" sx={{ color: "info.light" }}>
							Update available: {pkg.version ?? "?"} → <b>{update.version ?? "new build"}</b>
						</Typography>
						<Button size="small" variant="contained" color="info" sx={pillButton} onClick={() => setConfirming(true)} children="Update…" />
					</Stack>
				))}
			{hasSettings && !hideSettings && (
				<div hidden={collapsed}>
					<PluginSettingsErrorBoundary name={name}>
						<Settings />
					</PluginSettingsErrorBoundary>
				</div>
			)}
		</Stack>
	);
});
