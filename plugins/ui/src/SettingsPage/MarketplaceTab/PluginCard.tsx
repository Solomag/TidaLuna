import React from "react";

import { LunaPlugin, type PluginPackage } from "@luna/core";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { green, red } from "@mui/material/colors";

import SettingsIcon from "@mui/icons-material/Settings";

import { LunaAuthorDisplay } from "../../components";
import { hasNative, type CatalogEntry } from "./catalog";

type NativeInfo = "checking" | "unknown" | boolean | undefined;

const NativeChip = ({ native }: { native: NativeInfo }) => {
	if (native === undefined) return null;
	if (native === "checking" || native === "unknown") return <Chip size="small" variant="outlined" label={`native: ${native}`} />;
	return (
		<Tooltip
			title={
				native
					? "Registers native code that runs in TIDAL's main process (Luna asks for permission first)"
					: "No native module registration found in the built code"
			}
		>
			<Chip size="small" variant="outlined" color={native ? "warning" : "default"} label={native ? "native" : "no native"} />
		</Tooltip>
	);
};

const UpdateConfirm = React.memo(
	({ plugin, update, onDone, onCancel }: { plugin: LunaPlugin; update: PluginPackage; onDone: () => void; onCancel: () => void }) => {
		const [native, setNative] = React.useState<NativeInfo>("checking");
		const [busy, setBusy] = React.useState(false);
		const [error, setError] = React.useState<string>();
		const [attempt, retry] = React.useReducer((x: number) => x + 1, 0);
		React.useEffect(() => {
			setNative("checking");
			LunaPlugin.fetchCode(plugin.url)
				.then((code) => setNative(hasNative(code)))
				.catch(() => setNative("unknown"));
		}, [plugin, attempt]);
		const was = hasNative(plugin.code);
		return (
			<Stack spacing={1} sx={{ marginTop: 1, padding: 1, borderRadius: 1, backgroundColor: "rgba(255, 255, 255, 0.06)" }}>
				<Typography variant="body2">
					Update <b>{plugin.name}</b> {plugin.package?.version ?? "?"} → <b>{update.version ?? "new build"}</b>
				</Typography>
				<Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
					<NativeChip native={native} />
					{native === true && !was && <Typography variant="caption" color="warning.main" children="new: adds native code" />}
				</Stack>
				{native === "unknown" && <Typography variant="caption" color="warning.main" children="Couldn't fetch the new build to check it." />}
				{!plugin.enabled && <Typography variant="caption" sx={{ opacity: 0.8 }} children="Enable the plugin to update it." />}
				{error && <Typography variant="caption" color="error" children={`Update failed: ${error}`} />}
				<Stack direction="row" spacing={1}>
					<Button
						size="small"
						variant="contained"
						disabled={busy || !plugin.enabled || typeof native !== "boolean"}
						onClick={async () => {
							setBusy(true);
							setError(undefined);
							try {
								// reload() fetches the new package + code and loads it, same path as today's update on startup
								await plugin.reload();
								// reload() keeps the old code when the new one can't be fetched
								if (plugin.package?.hash !== update.hash) throw new Error(`still on ${plugin.package?.version ?? "the old build"}`);
								onDone();
							} catch (err: any) {
								setError(err?.message ?? String(err));
							} finally {
								setBusy(false);
							}
						}}
						children={busy ? "Updating…" : "Update"}
					/>
					{native === "unknown" && <Button size="small" disabled={busy} onClick={retry} children="Retry" />}
					<Button size="small" disabled={busy} onClick={onCancel} children="Not now" />
				</Stack>
			</Stack>
		);
	},
);

export const PluginCard = React.memo(
	({
		entry,
		installed,
		update,
		onUpdated,
		onOpenSettings,
	}: {
		entry: CatalogEntry;
		/** Passed so the memoized card re-renders on install/uninstall */
		installed: boolean;
		update?: PluginPackage;
		onUpdated: (url: string) => void;
		onOpenSettings: (plugin: LunaPlugin) => void;
	}) => {
		const { plugin, repository } = entry;
		const [busy, setBusy] = React.useState(false);
		const [confirming, setConfirming] = React.useState(false);
		const pkg = plugin.package;
		const native: NativeInfo = installed ? hasNative(plugin.code) : undefined;
		const hasSettings = installed && plugin.exports?.Settings !== undefined;

		const toggleInstall = async () => {
			setBusy(true);
			try {
				await (installed ? plugin.uninstall() : plugin.install());
			} finally {
				setBusy(false);
			}
		};

		return (
			<Stack
				spacing={1}
				data-luna-marketplace-plugin={plugin.name}
				sx={{
					padding: 1.5,
					borderRadius: 2,
					backgroundColor: installed ? "rgba(255, 255, 255, 0.09)" : "rgba(255, 255, 255, 0.04)",
					boxShadow: update ? "0 0 0 1px rgba(144, 202, 249, 0.6)" : 2,
					minHeight: 160,
				}}
			>
				<Stack direction="row" spacing={1} sx={{ alignItems: "baseline" }}>
					<Typography variant="subtitle1" sx={{ fontWeight: 600, lineHeight: 1.2, overflowWrap: "anywhere" }} children={plugin.name} />
					{pkg?.version && <Typography variant="caption" sx={{ opacity: 0.7 }} children={pkg.version} />}
					<Box sx={{ flexGrow: 1 }} />
					{hasSettings && (
						<Tooltip title="Plugin settings">
							<IconButton size="small" onClick={() => onOpenSettings(plugin)} children={<SettingsIcon fontSize="small" />} />
						</Tooltip>
					)}
				</Stack>
				{pkg?.author && <LunaAuthorDisplay author={pkg.author} />}
				<Typography
					variant="body2"
					sx={{ opacity: 0.8, flexGrow: 1, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}
					children={pkg?.description}
				/>
				<Stack direction="row" sx={{ flexWrap: "wrap", gap: 0.5 }}>
					{installed && <Chip size="small" variant="outlined" label="installed" sx={{ color: green[300], borderColor: green[300] }} />}
					{update && <Chip size="small" color="info" label={`update: ${update.version ?? "new build"}`} />}
					<NativeChip native={native} />
					<Chip size="small" variant="outlined" sx={{ opacity: 0.7, maxWidth: 160 }} label={repository?.name ?? "from url"} />
				</Stack>
				{confirming && update ? (
					<UpdateConfirm
						plugin={plugin}
						update={update}
						onCancel={() => setConfirming(false)}
						onDone={() => {
							setConfirming(false);
							onUpdated(plugin.url);
						}}
					/>
				) : (
					<Stack direction="row" spacing={1}>
						{update && <Button size="small" variant="contained" color="info" onClick={() => setConfirming(true)} children="Update…" />}
						<Tooltip title={installed ? "Uninstall (also removes its saved settings)" : ""}>
							<span>
								<Button
									size="small"
									variant={installed ? "outlined" : "contained"}
									color={installed ? "error" : "success"}
									sx={installed ? { color: red[300], borderColor: red[300] } : undefined}
									disabled={busy}
									onClick={toggleInstall}
									children={busy ? "…" : installed ? "Uninstall" : "Install"}
								/>
							</span>
						</Tooltip>
					</Stack>
				)}
			</Stack>
		);
	},
);
