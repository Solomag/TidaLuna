import React from "react";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { LunaPlugin } from "@luna/core";
import type { SettingsTabProps } from "../tabs";
import { devStoreUrl, useStores, useStoreUrls } from "./catalog";
import { InstallFromUrl } from "./InstallFromUrl";
import { availablePlugins, installedPlugins, matchingPluginNames, watchInstalledPlugins } from "./installedPlugins";
import { LunaPluginSettings } from "./LunaPluginSettings";
import { LunaStore } from "./LunaStore";
import { ReloadAllPlugins } from "./ReloadAllPlugins";

type Show = "all" | "installed" | "available";

/** Installed plugins and plugins from every store in one list, a plugin isn't tied to the store it came from */
export const PluginsTab = React.memo(({ active }: SettingsTabProps) => {
	const [query, setQuery] = React.useState("");
	const [descending, setDescending] = React.useState(false);
	const [show, setShow] = React.useState<Show>("all");
	const [storesOpen, setStoresOpen] = React.useState(false);

	const readInstalled = () => installedPlugins(Object.values(LunaPlugin.plugins), LunaPlugin.corePlugins, descending);
	const [installed, setInstalled] = React.useState(readInstalled);
	React.useEffect(() => watchInstalledPlugins(LunaPlugin.plugins, LunaPlugin.corePlugins, descending, setInstalled), [descending]);

	const urls = useStoreUrls();
	const { stores, loading } = useStores(urls, active);
	// The local dev store is only listed while it's running
	const shownStores = stores.filter((store) => store.url !== devStoreUrl || !store.error);
	const available = React.useMemo(
		() =>
			availablePlugins(
				stores.flatMap((store) => store.plugins),
				installed,
				LunaPlugin.corePlugins,
				descending,
			),
		[stores, installed, descending],
	);

	const visibleInstalled = matchingPluginNames(installed, query);
	const visibleAvailable = matchingPluginNames(available, query);
	const showInstalled = show !== "available";
	const showAvailable = show !== "installed";
	const storesLoading = loading && showAvailable;
	const nothingShown = (!showInstalled || !visibleInstalled.size) && (!showAvailable || !visibleAvailable.size);

	return (
		<Stack spacing={2}>
			<ReloadAllPlugins />
			<InstallFromUrl />
			<Stack direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ width: "100%", alignItems: { sm: "center" } }}>
				<TextField
					fullWidth
					type="search"
					placeholder="Search plugins"
					slotProps={{ htmlInput: { "aria-label": "Search plugins" } }}
					sx={{ flex: { sm: "1 1 0" }, minWidth: 0 }}
					value={query}
					onChange={(event) => setQuery(event.target.value)}
				/>
				<TextField
					select
					size="small"
					label="Show"
					value={show}
					sx={{ minWidth: 140, "& .MuiSelect-icon": { color: "text.secondary" } }}
					onChange={(event) => setShow(event.target.value as Show)}
				>
					<MenuItem value="all">All</MenuItem>
					<MenuItem value="installed">Installed</MenuItem>
					<MenuItem value="available">Not installed</MenuItem>
				</TextField>
				<TextField
					select
					size="small"
					label="Sort by name"
					value={descending ? "desc" : "asc"}
					sx={{ minWidth: 140, "& .MuiSelect-icon": { color: "text.secondary" } }}
					onChange={(event) => setDescending(event.target.value === "desc")}
				>
					<MenuItem value="asc">A–Z</MenuItem>
					<MenuItem value="desc">Z–A</MenuItem>
				</TextField>
			</Stack>
			<Button
				size="small"
				color="inherit"
				sx={{ alignSelf: "flex-start", textTransform: "none", opacity: 0.8 }}
				aria-expanded={storesOpen}
				endIcon={storesOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
				onClick={() => setStoresOpen((prev) => !prev)}
			>
				Stores ({shownStores.length})
			</Button>
			{storesOpen && shownStores.map((store) => <LunaStore key={store.url} store={store} />)}
			{/* Installed cards stay mounted while filtered out, so open settings keep their state */}
			{installed.map((plugin) => (
				<div key={plugin.url} hidden={!showInstalled || !visibleInstalled.has(plugin)}>
					<LunaPluginSettings plugin={plugin} />
				</div>
			))}
			{showAvailable &&
				available.filter((plugin) => visibleAvailable.has(plugin)).map((plugin) => <LunaPluginSettings key={plugin.url} plugin={plugin} />)}
			{storesLoading && <Typography variant="body2" sx={{ opacity: 0.7 }} children="Loading stores..." />}
			{!storesLoading && nothingShown && (
				<span role="status">
					{query.trim() ? "No plugins match your search." : show === "installed" ? "You have no plugins installed!" : "No plugins found."}
				</span>
			)}
		</Stack>
	);
});
