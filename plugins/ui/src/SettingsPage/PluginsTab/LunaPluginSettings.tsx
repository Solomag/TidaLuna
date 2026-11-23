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
import { LiveReloadToggle } from "./LiveReloadToggle";
import { LunaPluginHeader } from "./LunaPluginHeader";

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

// Which cards have their settings open, kept while Luna Settings is closed and reopened
const expandedCards = new Set<string>();

/** A plugin card: installed plugins get their controls and settings (opened in the card), others an Install button */
export const LunaPluginSettings = React.memo(({ plugin }: { plugin: LunaPlugin }) => {
	// Have to wrap in function call as Settings is a functional component
	// A new card can mount before install() finishes enabling the plugin.
	const enabled = React.useSyncExternalStore(plugin.onSetEnabled, () => Boolean(plugin.enabled));
	const subscribeLoading = React.useCallback((notify: () => void) => plugin.loading.onValue(notify), [plugin]);
	const loading = React.useSyncExternalStore(subscribeLoading, () => plugin.loading._);
	const [loadError, setLoadError] = React.useState(plugin.loadError._);
	const [installed, setInstalled] = React.useState(plugin.installed);
	const [installing, setInstalling] = React.useState(false);
	const [expanded, setExpanded] = React.useState(() => expandedCards.has(plugin.url));
	// Settings mount on first expand and stay mounted while collapsed, so they keep their state
	const [settingsMounted, setSettingsMounted] = React.useState(expanded);

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
	const install = React.useCallback(async () => {
		setInstalling(true);
		try {
			await plugin.install();
		} catch (err) {
			console.error(`[@luna/ui] Failed to install ${plugin.name}:`, err);
		} finally {
			setInstalling(false);
		}
	}, [plugin]);
	const toggleExpanded = React.useCallback(() => {
		const next = !expandedCards.has(plugin.url);
		if (next) expandedCards.add(plugin.url);
		else expandedCards.delete(plugin.url);
		setExpanded(next);
		setSettingsMounted(true);
	}, [plugin]);

	const disabled = !enabled || loading;

	const author = pkg.author;
	const desc = pkg.description;
	const name = pkg.name;
	const link = pkg.homepage ?? pkg.repository?.url;
	const version = plugin.isDev ? `${pkg.version ?? ""} [DEV]` : pkg.version;

	// Dont allow disabling core plugins
	const isCore = LunaPlugin.corePlugins.has(name);

	const Settings = plugin.exports?.Settings;
	const hasSettings = installed && Settings !== undefined && Settings !== null;
	const open = hasSettings && expanded;

	return (
		<Stack
			spacing={1}
			sx={{
				borderRadius: 3,
				backgroundColor: "rgba(0, 0, 0, 0.10)",
				boxShadow: loadError ? "0 0 10px rgba(255, 0, 0, 0.70)" : "none",
				padding: 2,
				paddingTop: 1,
				paddingBottom: open ? 2 : 1,
			}}
		>
			<LunaPluginHeader
				name={name}
				version={version}
				link={link}
				loadError={loadError}
				author={author}
				desc={desc}
				children={
					installed ? (
						<>
							{!isCore && (
								<Tooltip
									title={enabled ? `Disable ${name}` : `Enable ${name}`}
									children={<LunaSwitch checked={enabled} loading={loading} onChange={toggleEnabled} />}
								/>
							)}
							<SpinningButton title="Reload plugin" spin={loading} disabled={disabled} onClick={handleReload} />
							<LiveReloadToggle plugin={plugin} disabled={disabled} sx={{ marginLeft: 1 }} />
							{/* Don't show uninstall button for core plugins */}
							{!isCore && <LunaTrashButton title="Uninstall plugin" onClick={uninstall} />}
							{hasSettings && (
								<Tooltip title={expanded ? "Hide settings" : "Show settings"}>
									<IconButton
										color="primary"
										size="small"
										aria-label={`${expanded ? "Hide" : "Show"} ${name} settings`}
										aria-expanded={expanded}
										onClick={toggleExpanded}
									>
										{expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
									</IconButton>
								</Tooltip>
							)}
						</>
					) : (
						<Button size="small" variant="outlined" color="success" disabled={installing} onClick={install}>
							{installing ? "Installing..." : "Install"}
						</Button>
					)
				}
			/>
			{hasSettings && settingsMounted && (
				<div hidden={!expanded}>
					<PluginSettingsErrorBoundary name={name}>
						<Settings />
					</PluginSettingsErrorBoundary>
				</div>
			)}
		</Stack>
	);
});
