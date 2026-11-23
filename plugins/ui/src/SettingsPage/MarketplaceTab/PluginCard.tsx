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
import { hairline, pillButton, primaryButton, surface, surfaceHover, tag } from "./styles";

type NativeInfo = "checking" | "unknown" | boolean | undefined;

const NativeChip = ({ native }: { native: NativeInfo }) => {
	if (native === undefined) return null;
	if (native === "checking" || native === "unknown") return <Chip size="small" variant="outlined" sx={tag} label={`native: ${native}`} />;
	return (
		<Tooltip
			title={
				native
					? "Registers native code that runs in TIDAL's main process (Luna asks for permission first)"
					: "No native module registration found in the built code"
			}
		>
			<Chip size="small" variant={native ? "filled" : "outlined"} color={native ? "error" : "default"} sx={tag} label={native ? "native" : "no native"} />
		</Tooltip>
	);
};

/** Optional `preview` in a plugin's package.json: an https image shown on top of its card */
const previewOf = (pkg?: PluginPackage) => {
	const preview = (pkg as { preview?: unknown } | undefined)?.preview;
	return typeof preview === "string" && URL.parse(preview)?.protocol === "https:" ? preview : undefined;
};

const Preview = ({ src }: { src: string }) => {
	const [failed, setFailed] = React.useState(false);
	if (failed) return null;
	return (
		<Box
			component="img"
			src={src}
			alt=""
			loading="lazy"
			referrerPolicy="no-referrer"
			onError={() => setFailed(true)}
			sx={{ width: "100%", aspectRatio: "16 / 9", objectFit: "cover", borderRadius: 2, display: "block", backgroundColor: surface }}
		/>
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
			<Stack spacing={1} sx={{ padding: 1.25, borderRadius: 2, backgroundColor: surface, border: `1px solid ${hairline}` }}>
				<Typography variant="body2" sx={{ overflowWrap: "anywhere" }}>
					Update <b>{plugin.name}</b> {plugin.package?.version ?? "?"} → <b>{update.version ?? "new build"}</b>
				</Typography>
				<Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
					<NativeChip native={native} />
					{native === true && !was && <Typography variant="caption" color="warning.main" children="new: adds native code" />}
				</Stack>
				{native === "unknown" && <Typography variant="caption" color="warning.main" children="Couldn't fetch the new build to check it." />}
				{!plugin.enabled && <Typography variant="caption" sx={{ opacity: 0.8 }} children="Enable the plugin to update it." />}
				{error && <Typography variant="caption" color="error" children={`Update failed: ${error}`} />}
				<Stack direction="row" sx={{ flexWrap: "wrap", gap: 1 }}>
					<Button
						size="small"
						variant="contained"
						sx={primaryButton}
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
					{native === "unknown" && <Button size="small" sx={pillButton} disabled={busy} onClick={retry} children="Retry" />}
					<Button size="small" sx={{ ...pillButton, color: "text.secondary" }} disabled={busy} onClick={onCancel} children="Not now" />
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
		const preview = previewOf(pkg);

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
				spacing={1.25}
				data-luna-marketplace-plugin={plugin.name}
				sx={{
					padding: 2,
					borderRadius: 3,
					minWidth: 0,
					border: "1px solid",
					borderColor: update ? "rgba(144, 202, 249, 0.6)" : hairline,
					backgroundColor: installed ? surfaceHover : surface,
					transition: "background-color 120ms, border-color 120ms",
					"&:hover": { backgroundColor: "rgba(255, 255, 255, 0.12)", borderColor: update ? "rgba(144, 202, 249, 0.8)" : "rgba(255, 255, 255, 0.18)" },
				}}
			>
				{preview && <Preview key={preview} src={preview} />}
				<Stack direction="row" spacing={1} sx={{ alignItems: "center", minWidth: 0, minHeight: 28 }}>
					<Typography
						variant="subtitle1"
						noWrap
						title={plugin.name}
						sx={{ fontWeight: 700, lineHeight: 1.3, minWidth: 0, flexShrink: 1 }}
						children={plugin.name}
					/>
					{pkg?.version && <Typography variant="caption" sx={{ color: "text.secondary", flexShrink: 0 }} children={pkg.version} />}
					<Box sx={{ flexGrow: 1 }} />
					{hasSettings && (
						<Tooltip title="Plugin settings">
							<IconButton
								size="small"
								sx={{ flexShrink: 0, margin: -0.5, color: "text.secondary" }}
								onClick={() => onOpenSettings(plugin)}
								children={<SettingsIcon fontSize="small" />}
							/>
						</Tooltip>
					)}
				</Stack>
				{pkg?.author && <Box sx={{ minWidth: 0, overflowWrap: "anywhere" }} children={<LunaAuthorDisplay author={pkg.author} />} />}
				{/* The clamp sits in a growing box: growing the clamped text itself shows a cut 4th line */}
				<Box sx={{ flexGrow: 1 }}>
					<Typography
						variant="body2"
						sx={{
							color: "text.secondary",
							overflowWrap: "anywhere",
							display: "-webkit-box",
							WebkitLineClamp: 3,
							WebkitBoxOrient: "vertical",
							overflow: "hidden",
						}}
						children={pkg?.description}
					/>
				</Box>
				<Stack direction="row" sx={{ flexWrap: "wrap", gap: 0.5, minWidth: 0 }}>
					{installed && <Chip size="small" variant="outlined" label="installed" sx={{ ...tag, color: green[300], borderColor: green[300] }} />}
					{update && <Chip size="small" color="info" sx={tag} label={`update: ${update.version ?? "new build"}`} />}
					{/* Only the risky case gets a tag, like Spicetify's "external JS" */}
					{native === true && <NativeChip native />}
					<Chip size="small" variant="outlined" sx={{ ...tag, color: "text.secondary", maxWidth: "100%" }} title={repository?.url} label={repository?.name ?? "from url"} />
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
					<Stack direction="row" sx={{ paddingTop: 0.5, flexWrap: "wrap", gap: 1 }}>
						{update && <Button size="small" variant="contained" color="info" sx={pillButton} onClick={() => setConfirming(true)} children="Update…" />}
						<Tooltip title={installed ? "Uninstall (also removes its saved settings)" : ""}>
							<span>
								<Button
									size="small"
									variant={installed ? "text" : "contained"}
									sx={
										installed
											? {
													...pillButton,
													color: red[300],
													"&:hover": { backgroundColor: "rgba(229, 115, 115, 0.12)" },
													"&.Mui-disabled": { color: "rgba(229, 115, 115, 0.5)" },
												}
											: primaryButton
									}
									disabled={busy}
									onClick={toggleInstall}
									children={busy ? (installed ? "Removing…" : "Installing…") : installed ? "Uninstall" : "Install"}
								/>
							</span>
						</Tooltip>
					</Stack>
				)}
			</Stack>
		);
	},
);
