import React from "react";

import { LunaPlugin, type PluginPackage } from "@luna/core";

import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import { hasNative } from "./catalog";
import { displayName } from "../names";
import { hairline, pillButton, primaryButton, surface, tag } from "../styles";

/** Update confirmation shared by the Plugins tab: shows the version change and whether the new build registers native code */

export type NativeInfo = "checking" | "unknown" | boolean | undefined;

export const NativeChip = ({ native }: { native: NativeInfo }) => {
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
			<Chip
				size="small"
				variant={native ? "filled" : "outlined"}
				color={native ? "error" : "default"}
				sx={tag}
				label={native ? "native" : "no native"}
			/>
		</Tooltip>
	);
};

export const UpdateConfirm = React.memo(
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
					Update <b>{displayName(plugin.name)}</b> {plugin.package?.version ?? "?"} → <b>{update.version ?? "new build"}</b>
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
