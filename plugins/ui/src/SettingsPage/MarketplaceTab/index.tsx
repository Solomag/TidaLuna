import React from "react";

import type { LunaPlugin } from "@luna/core";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import SearchIcon from "@mui/icons-material/Search";
import StorageIcon from "@mui/icons-material/Storage";

import { SpinningButton } from "../../components";
import { LunaPluginSettings } from "../PluginsTab/LunaPluginSettings";
import { useCatalog, useInstalledVersion, useRepositoryUrls, useUpdates, withInstalled, type CatalogEntry } from "./catalog";
import { useDownloads } from "./downloads";
import { PluginCard } from "./PluginCard";
import { Repositories } from "./Repositories";
import { darkField, hairline, softButton, surface } from "./styles";

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

const filterNames: Record<Filter, string> = { all: "All plugins", installed: "Installed", available: "Available", updates: "Updates" };

const Section = ({ title, hint }: { title: string; hint?: string }) => (
	<Stack direction="row" sx={{ alignItems: "baseline", gap: 1, minWidth: 0 }}>
		<Typography variant="h6" noWrap title={title} sx={{ fontWeight: 700, fontSize: "1.15rem", minWidth: 0, flexShrink: hint ? 0 : 1 }} children={title} />
		{hint && <Typography variant="body2" noWrap sx={{ color: "text.secondary", minWidth: 0 }} children={hint} />}
	</Stack>
);

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
	const grid = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 2 };
	const installedCount = entries.filter((entry) => entry.plugin.installed).length;
	const counts: Record<Filter, number> = {
		all: entries.length,
		installed: installedCount,
		available: entries.length - installedCount,
		updates: updates.size,
	};

	return (
		<Stack spacing={2.5} sx={{ paddingBottom: 4 }}>
			<Stack spacing={0.25}>
				<Typography variant="h5" sx={{ fontWeight: 700 }} children="Marketplace" />
				<Typography variant="body2" sx={{ color: "text.secondary" }}>
					{loading ? "Loading repositories…" : `${entries.length} plugins from ${repositories.length} repositories`}
				</Typography>
			</Stack>
			<Stack direction="row" sx={{ alignItems: "center", gap: 1 }}>
				<TextField
					fullWidth
					size="small"
					type="search"
					placeholder="Search plugins, authors, repositories"
					sx={darkField}
					value={query}
					onChange={(event) => setQuery(event.target.value)}
					slotProps={{
						input: {
							startAdornment: (
								<InputAdornment position="start">
									<SearchIcon fontSize="small" sx={{ color: "text.secondary" }} />
								</InputAdornment>
							),
						},
					}}
				/>
				<SpinningButton title="Check for updates" spin={checking} disabled={checking || loading} onClick={check} />
				<Button
					size="small"
					startIcon={<StorageIcon />}
					aria-expanded={showRepos}
					aria-label={`Repositories (${repositories.length})`}
					sx={softButton(showRepos)}
					onClick={() => setShowRepos(!showRepos)}
				>
					Repositories
					<Box component="span" aria-hidden sx={{ marginLeft: 0.75, opacity: 0.6 }} children={repositories.length} />
				</Button>
			</Stack>
			{showRepos && <Repositories repositories={repositories} />}
			<Stack direction="row" sx={{ alignItems: "center", gap: 1, flexWrap: "wrap" }}>
				<Stack direction="row" role="group" aria-label="Show" sx={{ gap: 1, flexWrap: "wrap" }}>
					{(Object.keys(filterNames) as Filter[]).map((value) => {
						const label = value === "all" ? "All" : filterNames[value];
						return (
							<Button
								key={value}
								size="small"
								aria-pressed={filter === value}
								aria-label={`${label} (${counts[value]})`}
								sx={softButton(filter === value)}
								onClick={() => setFilter(value)}
							>
								{label}
								<Box component="span" aria-hidden sx={{ marginLeft: 0.75, opacity: 0.6 }} children={counts[value]} />
							</Button>
						);
					})}
				</Stack>
				<Box sx={{ flexGrow: 1 }} />
				<Stack direction="row" sx={{ alignItems: "center", gap: 1 }}>
					<Typography id="luna-marketplace-sort" variant="body2" sx={{ color: "text.secondary", whiteSpace: "nowrap" }} children="Sort by" />
					<Select
						variant="standard"
						disableUnderline
						labelId="luna-marketplace-sort"
						value={sort}
						onChange={(event) => setSort(event.target.value as Sort)}
						sx={{ fontSize: "0.875rem", fontWeight: 600, "& .MuiSelect-icon": { color: "text.secondary" } }}
					>
						<MenuItem value="downloads">Most downloaded</MenuItem>
						<MenuItem value="name">Name</MenuItem>
					</Select>
				</Stack>
			</Stack>
			{settingsFor?.installed && (
				<Stack spacing={1} ref={settingsRef} sx={{ padding: 2, borderRadius: 3, border: `1px solid ${hairline}`, backgroundColor: surface }}>
					<Button
						size="small"
						sx={{ ...softButton(), alignSelf: "flex-start" }}
						onClick={() => setSettingsFor(undefined)}
						children="← Back to all plugins"
					/>
					<LunaPluginSettings plugin={settingsFor} />
				</Stack>
			)}
			{popular.length > 0 && (
				<Stack spacing={1.5}>
					<Section title="Popular" hint="most downloaded, not installed yet" />
					<Box sx={grid} children={popular.map(card)} />
				</Stack>
			)}
			<Stack spacing={1.5}>
				<Section title={search ? `Results for “${query.trim()}”${filter === "all" ? "" : ` in ${filterNames[filter]}`}` : filterNames[filter]} />
				{!loading && !visible.length && (
					<Typography role="status" variant="body2" sx={{ color: "text.secondary", paddingY: 4, textAlign: "center" }} children="No plugins match." />
				)}
				<Box sx={grid} children={visible.map(card)} />
			</Stack>
		</Stack>
	);
});
