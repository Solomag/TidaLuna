import React from "react";

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
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import { compareNames, displayName } from "../names";
import { PageHeader } from "../PageHeader";
import { darkField, softButton } from "../styles";
import { marketplaceView, useCatalog, useInstalledThemes, useInstalledVersion, useRepositoryUrls, withInstalled } from "./catalog";
import { useDownloads } from "./downloads";
import { PluginCard } from "./PluginCard";
import { Repositories } from "./Repositories";
import { ThemeCard } from "./ThemeCard";

type Sort = "downloads" | "name";
type View = typeof marketplaceView._;
const allRepositories = "*";
/** Repository filter value for plugins installed from a plain url */
const fromUrl = "";

/** What the grid needs from a plugin or a theme */
type Item = {
	key: string;
	name: string;
	search: string;
	repositoryUrl: string;
	installed: boolean;
	card: (onPickRepository: (url: string) => void) => React.ReactNode;
};

const authorName = (author: unknown) => (typeof author === "string" ? author : ((author as { name?: string } | undefined)?.name ?? ""));
const searchText = (...parts: unknown[]) =>
	parts
		.filter((part) => typeof part === "string")
		.join(" ")
		.toLocaleLowerCase();

/**
 * Mock of a single repository page (replaces the Plugin Store tab): every plugin, or every theme, from every repository in one grid.
 * Installed plugins, their settings and updates live in the Plugins tab, installed themes in the Themes tab.
 */
export const MarketplaceTab = React.memo(() => {
	const urls = useRepositoryUrls();
	const { repositories, entries: listed, loading } = useCatalog(urls);
	const installedVersion = useInstalledVersion();
	const entries = React.useMemo(() => withInstalled(listed), [listed, installedVersion]);
	const installedThemes = useInstalledThemes();
	const downloads = useDownloads(repositories);

	const [view, setView] = React.useState<View>(marketplaceView._);
	React.useEffect(() => {
		const unload = marketplaceView.onValue(setView);
		return () => void unload();
	}, []);
	const [query, setQuery] = React.useState("");
	const [hideInstalled, setHideInstalled] = React.useState(false);
	const [repository, setRepository] = React.useState(allRepositories);
	const [sort, setSort] = React.useState<Sort>("downloads");
	const [showRepos, setShowRepos] = React.useState(false);

	const items: Item[] =
		view === "plugins"
			? entries.map(({ plugin, repository }) => ({
					key: plugin.url,
					name: plugin.name,
					search: searchText(displayName(plugin.name), plugin.package?.description, authorName(plugin.package?.author), repository?.name),
					repositoryUrl: repository?.url ?? fromUrl,
					installed: plugin.installed,
					card: (onPick) => (
						<PluginCard
							key={plugin.url}
							entry={{ plugin, repository }}
							installed={plugin.installed}
							downloads={downloads.get(plugin.url)}
							onPickRepository={onPick}
						/>
					),
				}))
			: repositories.flatMap((repo) =>
					repo.themes.map((theme) => ({
						key: theme.url,
						name: theme.name,
						search: searchText(theme.name, theme.description, authorName(theme.author), repo.name),
						repositoryUrl: repo.url,
						installed: installedThemes.has(theme.url),
						card: (onPick) => (
							<ThemeCard
								key={theme.url}
								theme={theme}
								installed={installedThemes.has(theme.url)}
								downloads={downloads.get(theme.url)}
								onPickRepository={onPick}
							/>
						),
					})),
				);
	const noun = view === "plugins" ? "plugins" : "themes";
	const countOf = (repo: (typeof repositories)[number]) => (view === "plugins" ? repo.plugins.length : repo.themes.length);

	const hasFromUrl = items.some((item) => item.repositoryUrl === fromUrl);
	// A removed repository (or one without anything in this view) can't stay selected
	const picked =
		repository === allRepositories ||
		(repository === fromUrl && hasFromUrl) ||
		repositories.some((repo) => repo.url === repository && countOf(repo) > 0)
			? repository
			: allRepositories;
	const pickedName = picked === fromUrl ? "Installed from url" : repositories.find((repo) => repo.url === picked)?.name;
	const pickRepository = React.useCallback((url: string) => setRepository(url), []);

	const search = query.trim().toLocaleLowerCase();
	const downloadsOf = (item: Item) => downloads.get(item.key) ?? -1;
	const visible = items
		.filter((item) => {
			if (hideInstalled && item.installed) return false;
			if (picked !== allRepositories && item.repositoryUrl !== picked) return false;
			return search === "" || item.search.includes(search);
		})
		.sort((a, b) => (sort === "downloads" ? downloadsOf(b) - downloadsOf(a) : 0) || compareNames(a.name, b.name));

	const scope = picked === allRepositories ? undefined : (pickedName ?? "Unknown repository");
	const heading = search ? `Results for “${query.trim()}”${scope ? ` in ${scope}` : ""}` : (scope ?? `All ${noun}`);
	const listing = repositories.filter((repo) => !repo.error && countOf(repo) > 0);

	return (
		<Stack spacing={2.5} sx={{ paddingBottom: 4 }}>
			<PageHeader
				title="Marketplace"
				subtitle={loading ? "Loading repositories…" : `${items.length} ${noun} from ${listing.length} of ${repositories.length} repositories`}
			/>
			<Stack direction="row" role="group" aria-label="Show" sx={{ gap: 1 }}>
				{(["plugins", "themes"] as const).map((value) => (
					<Button
						key={value}
						size="small"
						aria-pressed={view === value}
						sx={softButton(view === value)}
						onClick={() => (marketplaceView._ = value)}
						children={value === "plugins" ? "Plugins" : "Themes"}
					/>
				))}
			</Stack>
			<Stack direction="row" sx={{ alignItems: "center", gap: 1 }}>
				<TextField
					fullWidth
					size="small"
					type="search"
					placeholder={`Search ${noun}, authors, repositories`}
					sx={darkField}
					value={query}
					onChange={(event) => setQuery(event.target.value)}
					slotProps={{
						htmlInput: { "aria-label": `Search ${noun}` },
						input: {
							startAdornment: (
								<InputAdornment position="start">
									<SearchIcon fontSize="small" sx={{ color: "text.secondary" }} />
								</InputAdornment>
							),
						},
					}}
				/>
				<Button
					size="small"
					startIcon={<StorageIcon />}
					aria-expanded={showRepos}
					aria-label={`Manage repositories (${repositories.length})`}
					sx={softButton(showRepos)}
					onClick={() => setShowRepos(!showRepos)}
				>
					Repositories
					<Box component="span" aria-hidden sx={{ marginLeft: 0.75, opacity: 0.6 }} children={repositories.length} />
				</Button>
			</Stack>
			{showRepos && (
				<Repositories
					repositories={repositories}
					view={view}
					selected={picked}
					onPick={(url) => setRepository(url === picked ? allRepositories : url)}
				/>
			)}
			<Stack direction="row" sx={{ alignItems: "center", gap: 1, flexWrap: "wrap" }}>
				<Button
					size="small"
					startIcon={<VisibilityOffIcon />}
					aria-pressed={hideInstalled}
					sx={softButton(hideInstalled)}
					onClick={() => setHideInstalled(!hideInstalled)}
					children="Hide installed"
				/>
				<Select
					variant="standard"
					disableUnderline
					value={picked}
					inputProps={{ "aria-label": "Repository" }}
					onChange={(event) => setRepository(event.target.value)}
					renderValue={(value) => (value === allRepositories ? "All repositories" : (pickedName ?? "Unknown repository"))}
					sx={{
						...softButton(picked !== allRepositories),
						fontSize: "0.8125rem",
						maxWidth: 260,
						"& .MuiSelect-select, & .MuiSelect-select:focus": {
							backgroundColor: "transparent",
							paddingY: 0.6,
							paddingRight: "28px !important",
							overflow: "hidden",
							textOverflow: "ellipsis",
						},
						"& .MuiSelect-icon": { color: picked !== allRepositories ? "#000" : "text.secondary" },
					}}
					MenuProps={{ slotProps: { paper: { sx: { maxHeight: 420 } } } }}
				>
					<MenuItem value={allRepositories}>All repositories</MenuItem>
					{listing.map((repo) => (
						<MenuItem key={repo.url} value={repo.url}>
							{repo.name ?? repo.url}
							<Box component="span" sx={{ marginLeft: 1, opacity: 0.6 }} children={countOf(repo)} />
						</MenuItem>
					))}
					{hasFromUrl && <MenuItem value={fromUrl}>Installed from url</MenuItem>}
				</Select>
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
			<Stack spacing={1.5}>
				<Stack direction="row" sx={{ alignItems: "baseline", gap: 1, minWidth: 0 }}>
					<Typography variant="h6" noWrap title={heading} sx={{ fontWeight: 700, fontSize: "1.15rem", minWidth: 0 }} children={heading} />
					{!loading && <Typography variant="body2" sx={{ color: "text.secondary", flexShrink: 0 }} children={visible.length} />}
				</Stack>
				{!loading && !visible.length && (
					<Typography role="status" variant="body2" sx={{ color: "text.secondary", paddingY: 4, textAlign: "center" }}>
						{items.length ? `No ${noun} match.` : `No repository lists ${noun} yet.`}
					</Typography>
				)}
				<Box
					sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 2 }}
					children={visible.map((item) => item.card(pickRepository))}
				/>
			</Stack>
		</Stack>
	);
});
