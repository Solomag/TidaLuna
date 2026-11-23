import React from "react";

import type { LunaPlugin } from "@luna/core";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";

import { SpinningButton } from "../../components";
import { LunaPluginSettings } from "../PluginsTab/LunaPluginSettings";
import { useCatalog, useInstalledVersion, useRepositoryUrls, useUpdates, withInstalled, type CatalogEntry } from "./catalog";
import { useDownloads } from "./downloads";
import { PluginCard } from "./PluginCard";
import { Repositories } from "./Repositories";

type Filter = "all" | "installed" | "available" | "updates";
type Sort = "downloads" | "name";

/** How many of the most downloaded, not installed plugins are shown on top */
const popularCount = 3;

const byName = new Intl.Collator(undefined, { sensitivity: "base" });
const authorName = (author: unknown) => (typeof author === "string" ? author : ((author as { name?: string } | undefined)?.name ?? ""));
const searchText = ({ plugin, repository }: CatalogEntry) => {
	const desc = plugin.package?.description;
	return [plugin.name, typeof desc === "string" ? desc : "", authorName(plugin.package?.author), repository?.name ?? ""]
		.join(" ")
		.toLocaleLowerCase();
};

/**
 * Mock of a single plugins page: installed + available plugins in one grid, repositories (former stores) and updates on demand.
 * Uses the existing stores/plugins data as is.
 */
export const MarketplaceTab = React.memo(() => {
	const urls = useRepositoryUrls();
	const { repositories, entries: listed, loading } = useCatalog(urls);
	const installedVersion = useInstalledVersion();
	const entries = React.useMemo(() => withInstalled(listed), [listed, installedVersion]);
	const { updates, checking, check, applied } = useUpdates(entries);
	const downloads = useDownloads(repositories);

	const [query, setQuery] = React.useState("");
	const [filter, setFilter] = React.useState<Filter>("all");
	const [sort, setSort] = React.useState<Sort>("downloads");
	const [showRepos, setShowRepos] = React.useState(false);
	const [settingsFor, setSettingsFor] = React.useState<LunaPlugin>();
	if (settingsFor !== undefined && !settingsFor.installed) setSettingsFor(undefined);
	const settingsRef = React.useRef<HTMLDivElement>(null);
	React.useEffect(() => {
		if (settingsFor !== undefined) settingsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
	}, [settingsFor]);

	const search = query.trim().toLocaleLowerCase();
	const downloadsOf = (entry: CatalogEntry) => downloads.get(entry.plugin.url) ?? -1;
	// Best plugins in view: the most downloaded ones not installed yet, on the unfiltered page only
	const popular =
		filter === "all" && search === "" && downloads.size
			? entries
					.filter((entry) => !entry.plugin.installed && downloadsOf(entry) > 0)
					.sort((a, b) => downloadsOf(b) - downloadsOf(a))
					.slice(0, popularCount)
			: [];
	const visible = entries
		.filter((entry) => {
			const installed = entry.plugin.installed;
			if (filter === "installed" && !installed) return false;
			if (filter === "available" && installed) return false;
			if (filter === "updates" && !updates.has(entry.plugin.url)) return false;
			if (popular.includes(entry)) return false;
			return search === "" || searchText(entry).includes(search);
		})
		// Updates first, then installed, then by downloads or name
		.sort(
			(a, b) =>
				Number(updates.has(b.plugin.url)) - Number(updates.has(a.plugin.url)) ||
				Number(!!b.plugin.installed) - Number(!!a.plugin.installed) ||
				(sort === "downloads" ? downloadsOf(b) - downloadsOf(a) : 0) ||
				byName.compare(a.plugin.name, b.plugin.name),
		);
	const card = (entry: CatalogEntry) => (
		<PluginCard
			key={entry.plugin.url}
			entry={entry}
			installed={entry.plugin.installed}
			update={updates.get(entry.plugin.url)}
			onUpdated={applied}
			onOpenSettings={setSettingsFor}
		/>
	);
	const grid = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 1.5 };
	const installedCount = entries.filter((entry) => entry.plugin.installed).length;

	return (
		<Stack spacing={2}>
			<Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
				<TextField
					fullWidth
					size="small"
					type="search"
					placeholder="Search plugins, authors, repositories"
					sx={{ "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255, 255, 255, 0.2)" } }}
					value={query}
					onChange={(event) => setQuery(event.target.value)}
				/>
				<SpinningButton title="Check for updates" spin={checking} disabled={checking || loading} onClick={check} />
				<Button size="small" variant={showRepos ? "contained" : "outlined"} onClick={() => setShowRepos(!showRepos)} sx={{ whiteSpace: "nowrap" }}>
					Repositories ({repositories.length})
				</Button>
			</Stack>
			{showRepos && <Repositories repositories={repositories} />}
			<Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
				<ToggleButtonGroup
					size="small"
					exclusive
					sx={{ "& .MuiToggleButton-root": { color: "rgba(255, 255, 255, 0.7)", borderColor: "rgba(255, 255, 255, 0.2)" } }}
					value={filter}
					onChange={(_, next: Filter | null) => next && setFilter(next)}
				>
					<ToggleButton value="all" children={`All (${entries.length})`} />
					<ToggleButton value="installed" children={`Installed (${installedCount})`} />
					<ToggleButton value="available" children={`Available (${entries.length - installedCount})`} />
					<ToggleButton value="updates" children={`Updates (${updates.size})`} />
				</ToggleButtonGroup>
				<Box sx={{ flexGrow: 1 }} />
				<TextField
					select
					size="small"
					label="Sort"
					value={sort}
					sx={{ minWidth: 170, "& .MuiSelect-icon": { color: "text.secondary" } }}
					onChange={(event) => setSort(event.target.value as Sort)}
				>
					<MenuItem value="downloads">Most downloaded</MenuItem>
					<MenuItem value="name">Name</MenuItem>
				</TextField>
			</Stack>
			{settingsFor?.installed && (
				<Stack spacing={1} ref={settingsRef}>
					<Button size="small" sx={{ alignSelf: "flex-start" }} onClick={() => setSettingsFor(undefined)} children="← Back to all plugins" />
					<LunaPluginSettings plugin={settingsFor} />
				</Stack>
			)}
			{loading && <Typography variant="body2" sx={{ opacity: 0.7 }} children="Loading repositories…" />}
			{!loading && !visible.length && !popular.length && <Typography role="status" variant="body2" children="No plugins match." />}
			{popular.length > 0 && (
				<Stack spacing={1}>
					<Typography variant="subtitle2" sx={{ opacity: 0.8 }} children="Popular" />
					<Box sx={grid} children={popular.map(card)} />
					<Typography variant="subtitle2" sx={{ opacity: 0.8, paddingTop: 1 }} children="All plugins" />
				</Stack>
			)}
			<Box sx={grid} children={visible.map(card)} />
		</Stack>
	);
});
