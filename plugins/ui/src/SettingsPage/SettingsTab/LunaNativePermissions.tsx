import { ipcRenderer } from "@luna/lib";
import React from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { PageHeader } from "../PageHeader";
import { cardSx, emptyStateSx, hairline, softButton } from "../styles";

import type { NativePermissionEntry } from "../../../../../native/NativeModule/trust";

const answerText = {
	allow: "Allowed for this version",
	allowUpdates: "Allowed for all versions",
	deny: "Denied",
} as const;

const answerColor = {
	allow: "text.primary",
	allowUpdates: "warning.main",
	deny: "error.main",
} as const;

// "@scope/plugin/file.native.ts" -> plugin "@scope/plugin", file "file.native.ts"
const splitFileName = (fileName: string) => {
	const slash = fileName.lastIndexOf("/");
	return slash === -1 ? { plugin: fileName, file: fileName } : { plugin: fileName.slice(0, slash), file: fileName.slice(slash + 1) };
};

type PluginGroup = { plugin: string; source: string; checked: boolean; entries: NativePermissionEntry[] };

/** Answers grouped by the plugin they were given to (its url), files sorted by name */
const groupByPlugin = (entries: NativePermissionEntry[]): PluginGroup[] => {
	const groups = new Map<string, PluginGroup>();
	for (const entry of entries) {
		const source = entry.url ?? entry.claimedUrl ?? "Unknown source";
		const plugin = splitFileName(entry.fileName).plugin;
		const id = `${source}\n${plugin}`;
		let group = groups.get(id);
		if (group === undefined) groups.set(id, (group = { plugin, source, checked: entry.url !== undefined, entries: [] }));
		group.entries.push(entry);
	}
	for (const group of groups.values()) group.entries.sort((a, b) => a.fileName.localeCompare(b.fileName));
	return [...groups.values()].sort((a, b) => a.plugin.localeCompare(b.plugin));
};

/** Settings > Native permissions: what plugins' native code may do, as answered in the permission window */
export const LunaNativePermissions = React.memo(({ switcher }: { switcher: React.ReactNode }) => {
	const [entries, setEntries] = React.useState<NativePermissionEntry[]>([]);
	const [loaded, setLoaded] = React.useState(false);
	const refresh = React.useCallback(async () => {
		setEntries(await ipcRenderer.invoke("__Luna.nativePermissions.list"));
		setLoaded(true);
	}, []);
	React.useEffect(() => void refresh(), [refresh]);

	const revoke = React.useCallback(
		async (key: string) => {
			await ipcRenderer.invoke("__Luna.nativePermissions.revoke", key);
			await refresh();
		},
		[refresh],
	);

	const groups = groupByPlugin(entries);
	return (
		<Stack spacing={2.5} sx={{ paddingBottom: 4 }}>
			<PageHeader
				title="Settings"
				subtitle="Whether plugins' native code may run in TIDAL's main process, as you answered when it asked. Revoke an answer to be asked again the next time the plugin loads"
			/>
			{switcher}
			{loaded && groups.length === 0 && (
				<Typography role="status" variant="body2" sx={emptyStateSx} children="No answers yet: plugins with native code ask when they first load." />
			)}
			{groups.map(({ plugin, source, checked, entries }) => (
				<Box key={`${source}\n${plugin}`} component="section" data-luna-native-permissions={plugin} sx={cardSx}>
					<Typography variant="subtitle1" component="h3" sx={{ fontWeight: 700 }} children={plugin} />
					<Typography variant="body2" sx={{ color: "text.secondary", overflowWrap: "anywhere" }}>
						{source}
						{!checked && " (not checked: answers hold for this version only)"}
					</Typography>
					<Stack sx={{ marginTop: 1 }}>
						{entries.map(({ key, fileName, answer, modules }) => (
							<Stack
								key={key}
								direction="row"
								sx={{
									alignItems: "center",
									gap: 2,
									paddingY: 1,
									borderTop: "1px solid",
									borderColor: hairline,
									"&:first-of-type": { borderTop: "none" },
								}}
							>
								<Box sx={{ minWidth: 0, flexGrow: 1 }}>
									<Typography variant="body2" sx={{ fontFamily: "monospace" }} children={splitFileName(fileName).file} />
									{modules.length > 0 && (
										<Typography
											variant="caption"
											sx={{ color: "text.secondary", overflowWrap: "anywhere" }}
											children={`Its code names ${modules.join(", ")} (for information, not a limit)`}
										/>
									)}
								</Box>
								<Typography variant="body2" sx={{ color: answerColor[answer], whiteSpace: "nowrap" }} children={answerText[answer]} />
								<Button size="small" sx={softButton()} aria-label={`Revoke the answer for ${fileName}`} onClick={() => revoke(key)} children="Revoke" />
							</Stack>
						))}
					</Stack>
				</Box>
			))}
		</Stack>
	);
});
