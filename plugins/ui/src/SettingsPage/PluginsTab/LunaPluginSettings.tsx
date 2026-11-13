import React from "react";
import type { ErrorInfo, ReactNode } from "react";

import { LunaPlugin, unloadSet, type PluginPackage } from "@luna/core";
import { store as obyStore } from "oby";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import { LunaSwitch, LunaTrashButton, SpinningButton } from "../../components";
import { actionIconColor, useLunaUiAppearance } from "../../appearance";
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

export const LunaPluginSettings = React.memo(({ plugin }: { plugin: LunaPlugin }) => {
	useLunaUiAppearance();
	const [enabled, setEnabled] = React.useState(plugin.enabled);
	const [loading, setLoading] = React.useState(plugin.loading._);
	const [loadError, setLoadError] = React.useState(plugin.loadError._);
	const [installed, setInstalled] = React.useState(plugin.installed);
	const [hideSettings, setHideSettings] = React.useState(plugin.store.hideSettings);
	const [pkg, setPackage] = React.useState<PluginPackage>(obyStore.unwrap(plugin.store.package));

	React.useEffect(() => {
		const unloads = new Set([
			plugin.onSetEnabled((next) => setEnabled(next)),
			plugin.loading.onValue((next) => setLoading(next)),
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
		return () => unloadSet(unloads);
	}, [plugin]);

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
	const version = isDev ? `${pkg.version ?? ""} [DEV]` : pkg.version;
	const isCore = LunaPlugin.corePlugins.has(name);
	const Settings = plugin.exports?.Settings;
	const hasSettings = Settings !== undefined && Settings !== null;
	const settingsVisible = hasSettings && !hideSettings;

	return (
		<Box
			sx={{
				width: "100%",
				minWidth: 0,
				boxSizing: "border-box",
				borderRadius: 3,
				backgroundColor: "rgba(0, 0, 0, 0.10)",
				boxShadow: loadError ? "0 0 10px rgba(255, 0, 0, 0.70)" : "none",
				overflow: "hidden",
			}}
		>
			<Box sx={{ padding: 2 }}>
				<LunaPluginHeader name={name} version={version} link={link} loadError={loadError} author={author} desc={desc}>
					{!isCore && (
						<Tooltip
							title={enabled ? `Disable ${name}` : `Enable ${name}`}
							children={<LunaSwitch checked={enabled} loading={loading} onChange={toggleEnabled} />}
						/>
					)}
					<SpinningButton title="Reload plugin" spin={loading} disabled={disabled} onClick={handleReload} sxColor={actionIconColor("reload")} />
					<LiveReloadToggle plugin={plugin} disabled={disabled} sx={{ color: actionIconColor("liveReload") }} />
					<SpinningButton
						title={hideSettings ? "Show settings" : "Hide settings"}
						spin={loading}
						disabled={!enabled || !hasSettings}
						onClick={() => setHideSettings((prev) => (plugin.store.hideSettings = !prev))}
						icon={SettingsIcon}
						sxColor={actionIconColor("settings")}
					/>
					{!isCore && <LunaTrashButton title="Uninstall plugin" onClick={uninstall} sx={{ color: actionIconColor("uninstall") }} />}
				</LunaPluginHeader>
			</Box>

			{settingsVisible && (
				<>
					<Divider />
					<Box sx={{ width: "100%", minWidth: 0, boxSizing: "border-box", padding: 2 }}>
						<PluginSettingsErrorBoundary name={name}>
							<Settings />
						</PluginSettingsErrorBoundary>
					</Box>
				</>
			)}
		</Box>
	);
});
