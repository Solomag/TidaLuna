import React from "react";

import type { LunaPlugin } from "@luna/core";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";

import { SpinningButton } from "../../components";
import { LunaPluginSettings } from "../PluginsTab/LunaPluginSettings";
import { useCatalog, useInstalledVersion, useRepositoryUrls, useUpdates, type CatalogEntry } from "./catalog";
import { PluginCard } from "./PluginCard";
import { Repositories } from "./Repositories";

type Filter = "all" | "installed" | "available" | "updates";

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
	const { repositories, entries, loading } = useCatalog(urls);
	const { updates, checking, check, applied } = useUpdates(entries);
	useInstalledVersion();

	const [query, setQuery] = React.useState("");
	const [filter, setFilter] = React.useState<Filter>("all");
	const [showRepos, setShowRepos] = React.useState(false);
	const [settingsFor, setSettingsFor] = React.useState<LunaPlugin>();

	const search = query.trim().toLocaleLowerCase();
	const visible = entries
		.filter((entry) => {
			const installed = entry.plugin.installed;
			if (filter === "installed" && !installed) return false;
			if (filter === "available" && installed) return false;
			if (filter === "updates" && !updates.has(entry.plugin.url)) return false;
			return search === "" || searchText(entry).includes(search);
		})
		// Updates first, then installed, then by name
		.sort(
			(a, b) =>
				Number(updates.has(b.plugin.url)) - Number(updates.has(a.plugin.url)) ||
				Number(!!b.plugin.installed) - Number(!!a.plugin.installed) ||
				byName.compare(a.plugin.name, b.plugin.name),
		);
	const installedCount = entries.filter((entry) => entry.plugin.installed).length;

	return (
		<Stack spacing={2}>
			<Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
				<TextField
					fullWidth
					size="small"
					type="search"
					placeholder="Search plugins, authors, repositories"
					value={query}
					onChange={(event) => setQuery(event.target.value)}
				/>
				<SpinningButton title="Check for updates" spin={checking} disabled={checking || loading} onClick={check} />
				<Button size="small" variant={showRepos ? "contained" : "outlined"} onClick={() => setShowRepos(!showRepos)} sx={{ whiteSpace: "nowrap" }}>
					Repositories ({repositories.length})
				</Button>
			</Stack>
			{showRepos && <Repositories repositories={repositories} />}
			<ToggleButtonGroup size="small" exclusive value={filter} onChange={(_, next: Filter | null) => next && setFilter(next)}>
				<ToggleButton value="all" children={`All (${entries.length})`} />
				<ToggleButton value="installed" children={`Installed (${installedCount})`} />
				<ToggleButton value="available" children={`Available (${entries.length - installedCount})`} />
				<ToggleButton value="updates" children={`Updates (${updates.size})`} />
			</ToggleButtonGroup>
			{settingsFor?.installed && (
				<Stack spacing={1}>
					<Button size="small" sx={{ alignSelf: "flex-start" }} onClick={() => setSettingsFor(undefined)} children="← Back to all plugins" />
					<LunaPluginSettings plugin={settingsFor} />
				</Stack>
			)}
			{loading && <Typography variant="body2" sx={{ opacity: 0.7 }} children="Loading repositories…" />}
			{!loading && !visible.length && <Typography role="status" variant="body2" children="No plugins match." />}
			<Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 1.5 }}>
				{visible.map((entry) => (
					<PluginCard
						key={entry.plugin.url}
						entry={entry}
						installed={entry.plugin.installed}
						update={updates.get(entry.plugin.url)}
						onUpdated={applied}
						onOpenSettings={setSettingsFor}
					/>
				))}
			</Box>
		</Stack>
	);
});
