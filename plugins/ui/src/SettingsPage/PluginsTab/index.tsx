import React from "react";

import Box from "@mui/material/Box";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import SearchIcon from "@mui/icons-material/Search";

import { LunaPlugin } from "@luna/core";
import { SpinningButton } from "../../components";
import { useUpdates } from "../MarketplaceTab/catalog";
import { PageHeader } from "../PageHeader";
import { darkField } from "../styles";
import { installedPlugins, matchingPluginNames, watchInstalledPlugins } from "./installedPlugins";
import { LunaPluginSettings } from "./LunaPluginSettings";
import { ReloadAllPlugins } from "./ReloadAllPlugins";

/** Installed plugins (the library): settings, enable/disable, reload and updates. New plugins come from the Marketplace tab. */
export const PluginsTab = React.memo(() => {
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
	const summary = `${eligible.length} installed${updates.size ? ` · ${updates.size} update${updates.size === 1 ? "" : "s"} available` : ""}`;

	return (
		<Stack spacing={2.5} sx={{ paddingBottom: 4 }}>
			<PageHeader title="Plugins" subtitle={summary} highlight={updates.size > 0} />
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
				<SpinningButton title="Check for updates" spin={checking} disabled={checking || !eligible.length} onClick={check} />
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
				<Typography role="status" variant="body2" sx={{ color: "text.secondary", paddingY: 4, textAlign: "center" }}>
					You have no plugins installed. Find some in the Marketplace tab.
				</Typography>
			)}
			{!!eligible.length && !visible.size && (
				<Typography
					role="status"
					variant="body2"
					sx={{ color: "text.secondary", paddingY: 4, textAlign: "center" }}
					children="No installed plugins match your search."
				/>
			)}
			<Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
				{ordered.map((plugin) => (
					<div key={plugin.url} hidden={!visible.has(plugin)}>
						<LunaPluginSettings plugin={plugin} update={updates.get(plugin.url)} onUpdated={applied} />
					</div>
				))}
			</Box>
		</Stack>
	);
});
