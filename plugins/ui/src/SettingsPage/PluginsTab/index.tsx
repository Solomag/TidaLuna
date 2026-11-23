import React from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import SearchIcon from "@mui/icons-material/Search";
import SystemUpdateAltIcon from "@mui/icons-material/SystemUpdateAlt";

import { LunaPlugin } from "@luna/core";
import { useUpdates } from "../MarketplaceTab/catalog";
import { PageHeader } from "../PageHeader";
import { cardGridSx, darkField, emptyStateSx, pillButton } from "../styles";
import { InstalledPluginCard } from "./InstalledPluginCard";
import { installedPlugins, matchingPluginNames, watchInstalledPlugins } from "./installedPlugins";
import { ReloadAllPlugins } from "./ReloadAllPlugins";

/** Blue outline like the update notices on the cards, so it doesn't read as one more grey Reload button */
const checkUpdatesSx = {
	...pillButton,
	color: "info.light",
	border: "1px solid rgba(144, 202, 249, 0.5)",
	"&:hover": { backgroundColor: "rgba(144, 202, 249, 0.1)", borderColor: "info.light" },
	"@keyframes spin": { "0%": { transform: "rotate(0deg)" }, "100%": { transform: "rotate(360deg)" } },
};

/** Installed plugins as cards: on/off, settings, reload, updates. New plugins come from the Marketplace tab. */
export const PluginsView = React.memo(({ switcher }: { switcher: React.ReactNode }) => {
	const [query, setQuery] = React.useState("");
	const [descending, setDescending] = React.useState(false);
	const readInstalled = () => installedPlugins(Object.values(LunaPlugin.plugins), LunaPlugin.corePlugins, descending);
	const [eligible, setEligible] = React.useState(readInstalled);
	React.useEffect(() => watchInstalledPlugins(LunaPlugin.plugins, LunaPlugin.corePlugins, descending, setEligible), [descending]);
	const entries = React.useMemo(() => eligible.map((plugin) => ({ plugin })), [eligible]);
	const { updates, checking, check, applied } = useUpdates(entries);

	const visible = matchingPluginNames(eligible, query);
	// Plugins with an update first, otherwise by name
	const ordered = [...eligible.filter((plugin) => updates.has(plugin.url)), ...eligible.filter((plugin) => !updates.has(plugin.url))];
	const summary = `${eligible.length} plugins installed${updates.size ? ` · ${updates.size} update${updates.size === 1 ? "" : "s"} available` : ""}`;

	return (
		<Stack spacing={2.5} sx={{ paddingBottom: 4 }}>
			<PageHeader title="Installed" subtitle={summary} highlight={updates.size > 0} />
			{switcher}
			<Stack direction="row" sx={{ alignItems: "center", gap: 1 }}>
				<TextField
					fullWidth
					size="small"
					type="search"
					placeholder="Search installed plugins"
					sx={darkField}
					value={query}
					onChange={(event) => setQuery(event.target.value)}
					slotProps={{
						htmlInput: { "aria-label": "Search installed plugins" },
						input: {
							startAdornment: (
								<InputAdornment position="start">
									<SearchIcon fontSize="small" sx={{ color: "text.secondary" }} />
								</InputAdornment>
							),
						},
					}}
				/>
				<Tooltip title="Look for newer builds of your plugins (nothing is installed without your OK)">
					<span style={{ flexShrink: 0 }}>
						<Button
							size="small"
							startIcon={<SystemUpdateAltIcon sx={{ animation: checking ? "spin 1s linear infinite" : "none" }} />}
							sx={checkUpdatesSx}
							disabled={checking || !eligible.length}
							onClick={check}
							children={checking ? "Checking…" : "Check for updates"}
						/>
					</span>
				</Tooltip>
				<ReloadAllPlugins />
				<Box sx={{ flexShrink: 0 }}>
					<Select
						variant="standard"
						disableUnderline
						value={descending ? "desc" : "asc"}
						inputProps={{ "aria-label": "Sort by name" }}
						onChange={(event) => setDescending(event.target.value === "desc")}
						sx={{ fontSize: "0.875rem", fontWeight: 600, "& .MuiSelect-icon": { color: "text.secondary" } }}
					>
						<MenuItem value="asc">A–Z</MenuItem>
						<MenuItem value="desc">Z–A</MenuItem>
					</Select>
				</Box>
			</Stack>
			{!eligible.length && (
				<Typography role="status" variant="body2" sx={emptyStateSx} children="You have no plugins installed. Find some in the Marketplace tab." />
			)}
			{!!eligible.length && !visible.size && (
				<Typography role="status" variant="body2" sx={emptyStateSx} children="No installed plugins match your search." />
			)}
			<Box sx={cardGridSx}>
				{ordered.map((plugin) => (
					<Box
						key={plugin.url}
						hidden={!visible.has(plugin)}
						sx={{ display: visible.has(plugin) ? "flex" : "none", minWidth: 0, "& > *": { flexGrow: 1 } }}
					>
						<InstalledPluginCard plugin={plugin} update={updates.get(plugin.url)} onUpdated={applied} />
					</Box>
				))}
			</Box>
		</Stack>
	);
});
