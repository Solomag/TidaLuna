import React from "react";

import { LunaPlugin, type PluginPackage } from "@luna/core";

import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import CachedIcon from "@mui/icons-material/Cached";
import CloseIcon from "@mui/icons-material/Close";
import SensorsIcon from "@mui/icons-material/Sensors";
import SensorsOffIcon from "@mui/icons-material/SensorsOff";
import TuneIcon from "@mui/icons-material/Tune";

import { LunaLink } from "../../components";
import { CardShell } from "../MarketplaceTab/cardParts";
import { hasNative } from "../MarketplaceTab/catalog";
import { packagePreview } from "../MarketplaceTab/PluginCard";
import { NativeChip, UpdateConfirm } from "../MarketplaceTab/UpdateConfirm";
import { displayName } from "../names";
import { pillButton, softButton, tag } from "../styles";
import { CardActions, UninstallMenuItem } from "./CardActions";
import { PluginSettingsErrorBoundary, usePluginState } from "./pluginState";

const errorBorder = "rgba(229, 115, 115, 0.7)";
const updateBorder = "rgba(144, 202, 249, 0.6)";

/** Plugin settings open in a dialog over the page, like Spicetify's settings, so the cards stay a tidy grid */
const SettingsDialog = ({ plugin, name, open, onClose }: { plugin: LunaPlugin; name: string; open: boolean; onClose: () => void }) => {
	const Settings = plugin.exports?.Settings;
	return (
		<Dialog open={open} onClose={onClose} fullWidth maxWidth="md" aria-labelledby={`luna-settings-${plugin.name}`}>
			<DialogTitle id={`luna-settings-${plugin.name}`} sx={{ display: "flex", alignItems: "center", gap: 1, fontWeight: 700 }}>
				{name}
				<Typography variant="body2" component="span" sx={{ color: "text.secondary" }} children="settings" />
				<IconButton aria-label="Close" onClick={onClose} sx={{ marginLeft: "auto", color: "text.secondary" }} children={<CloseIcon />} />
			</DialogTitle>
			<DialogContent sx={{ paddingBottom: 3 }}>
				{Settings && (
					<PluginSettingsErrorBoundary name={plugin.name}>
						<Settings />
					</PluginSettingsErrorBoundary>
				)}
			</DialogContent>
		</Dialog>
	);
};

/**
 * Installed plugin in the Installed tab: the Marketplace card with a switch, Settings and a menu instead of Install.
 * Core plugins (Settings tab) get the same card without the switch and Uninstall, they can't be turned off.
 */
export const InstalledPluginCard = React.memo(
	({ plugin, update, onUpdated, core }: { plugin: LunaPlugin; update?: PluginPackage; onUpdated?: (url: string) => void; core?: boolean }) => {
		const { enabled, loading, loadError, installed, pkg, isDev, version, link } = usePluginState(plugin);
		const [liveReload, setLiveReload] = React.useState(plugin.liveReload);
		React.useEffect(() => {
			const unload = plugin.onSetLiveReload(setLiveReload);
			return () => void unload();
		}, [plugin]);
		const [settingsOpen, setSettingsOpen] = React.useState(false);
		const [confirming, setConfirming] = React.useState(false);

		const toggleEnabled = React.useCallback((_: unknown, checked: boolean) => (checked ? plugin.enable() : plugin.disable()), [plugin]);

		if (!installed) return null;

		// Core plugins are known by their short package names (lib, ui, dev)
		const name = core ? pkg.name : displayName(pkg.name);
		const hasSettings = plugin.exports?.Settings !== undefined && plugin.exports?.Settings !== null;
		const busy = !enabled || loading;

		return (
			<>
				{hasSettings && <SettingsDialog plugin={plugin} name={name} open={settingsOpen} onClose={() => setSettingsOpen(false)} />}
				<CardShell
					id={pkg.name}
					idAttribute="data-luna-plugin-card"
					name={<LunaLink href={link} children={name} />}
					title={pkg.name}
					version={version}
					preview={packagePreview(pkg)}
					author={pkg.author}
					description={pkg.description}
					highlight={loadError ? errorBorder : update ? updateBorder : undefined}
					tags={
						(hasNative(plugin.code) || isDev) && (
							<>
								{hasNative(plugin.code) && <NativeChip native />}
								{isDev && <Chip size="small" color="info" sx={tag} label="dev" />}
							</>
						)
					}
					notice={
						<>
							{loadError && <Typography variant="caption" role="alert" sx={{ color: "error.light", overflowWrap: "anywhere" }} children={loadError} />}
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
										<Typography variant="body2" sx={{ color: "info.light", minWidth: 0, overflowWrap: "anywhere" }}>
											{pkg.version ?? "?"} → <b>{update.version ?? "new build"}</b>
										</Typography>
										<Button size="small" variant="contained" color="info" sx={pillButton} onClick={() => setConfirming(true)} children="Update…" />
									</Stack>
								))}
						</>
					}
					actions={
						<CardActions
							name={name}
							enabled={core ? undefined : enabled}
							loading={loading}
							onToggle={toggleEnabled}
							menu={(close) => [
								<MenuItem
									key="reload"
									disabled={busy}
									onClick={() => {
										close();
										void plugin.reload();
									}}
								>
									<ListItemIcon children={<CachedIcon fontSize="small" />} />
									Reload
								</MenuItem>,
								<MenuItem
									key="live"
									disabled={busy}
									onClick={() => {
										close();
										plugin.liveReload = !plugin.liveReload;
									}}
								>
									<ListItemIcon children={liveReload ? <SensorsIcon fontSize="small" color="success" /> : <SensorsOffIcon fontSize="small" />} />
									{liveReload ? "Turn off live reload" : "Live reload (for development)"}
								</MenuItem>,
								...(core
									? []
									: [
											<UninstallMenuItem
												key="uninstall"
												label="Uninstall (removes its settings)"
												onClick={() => {
													close();
													void plugin.uninstall();
												}}
											/>,
										]),
							]}
						>
							{hasSettings && (
								<Button
									size="small"
									startIcon={<TuneIcon />}
									disabled={!enabled}
									sx={softButton()}
									onClick={() => setSettingsOpen(true)}
									children="Settings"
								/>
							)}
						</CardActions>
					}
				/>
			</>
		);
	},
);
