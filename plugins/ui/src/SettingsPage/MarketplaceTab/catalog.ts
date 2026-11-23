import React from "react";

import { Signal } from "@inrixia/helpers";
import { effect, store as obyStore } from "oby";

import { LunaPlugin, type LunaAuthor, type PluginPackage } from "@luna/core";

import { themes } from "../Storage";
import { storeUrls } from "../stores";

export const devStoreUrl = "http://127.0.0.1:3000";

/**
 * Mock: a theme listed in a repository's store.json under an optional `themes` field, next to `plugins`.
 * Either a css url (absolute or relative to the store) or an object with the url and what the card shows.
 */
export type ThemeListing = string | { url: string; name?: string; description?: string; author?: LunaAuthor | string; preview?: string };
export type Theme = { url: string; name: string; description?: string; author?: LunaAuthor | string; preview?: string; repository: Repository };

export type Repository = {
	url: string;
	name?: string;
	author?: LunaAuthor | string;
	plugins: string[];
	themes: Theme[];
	error?: string;
};

/** Which catalog the Marketplace shows, the Themes tab switches it to themes */
export const marketplaceView = new Signal<"plugins" | "themes">("plugins");
/** "Hide installed" in the Marketplace, kept while you visit other tabs */
export const hideInstalledInMarketplace = new Signal(false);

// Themes are css loaded into TIDAL's page, so only https (or the local dev store) is accepted
const themeUrl = (storeUrl: string, entry: string) => {
	const url = URL.parse(entry, `${storeUrl}/`);
	if (url === null || !url.pathname.endsWith(".css")) return;
	if (url.protocol === "https:" || (storeUrl === devStoreUrl && url.origin === devStoreUrl)) return url.href;
};
const nameFromUrl = (url: string) => {
	const file = url.slice(url.lastIndexOf("/") + 1).replace(/\.css$/, "");
	let name = file;
	try {
		name = decodeURIComponent(file);
	} catch {}
	return name.replaceAll(/[-_.]+/g, " ");
};
const parseThemes = (repository: Repository, listings: unknown): Theme[] => {
	if (!Array.isArray(listings)) return [];
	const themes: Theme[] = [];
	for (const listing of listings as ThemeListing[]) {
		const info = typeof listing === "string" ? { url: listing } : listing;
		if (typeof info?.url !== "string") continue;
		const url = themeUrl(repository.url, info.url);
		if (url === undefined) continue;
		const text = (value: unknown) => (typeof value === "string" && value.trim() !== "" ? value : undefined);
		themes.push({
			url,
			name: text(info.name) ?? nameFromUrl(url),
			description: text(info.description),
			author: typeof info.author === "string" || typeof info.author?.name === "string" ? info.author : undefined,
			preview: text(info.preview),
			repository,
		});
	}
	return themes;
};

export type CatalogEntry = {
	plugin: LunaPlugin;
	/** Repository the plugin is listed in, undefined when it was installed from a url */
	repository?: Repository;
};

/** Native code is registered through this call, see build/plugins/lunaNativePlugin.ts */
export const hasNative = (code?: string) => code !== undefined && /__Luna\.registerNative\b/.test(code);

const fetchRepository = async (url: string): Promise<Repository> => {
	try {
		// A repository that never answers would keep the Marketplace loading
		const res = await fetch(`${url}/store.json`, { signal: AbortSignal.timeout(15_000) });
		if (!res.ok) throw new Error(res.statusText || `HTTP ${res.status}`);
		const pkg: PluginPackage & { plugins?: string[]; themes?: unknown } = await res.json();
		const repository: Repository = { url, name: pkg.name, author: pkg.author, plugins: pkg.plugins ?? [], themes: [] };
		repository.themes = parseThemes(repository, pkg.themes);
		return repository;
	} catch (err: any) {
		return { url, plugins: [], themes: [], error: err?.message ?? String(err) };
	}
};

/** Repositories (stores) the user has added, kept in sync with storeUrls */
export const useRepositoryUrls = () => {
	const [urls, setUrls] = React.useState<string[]>(() => [...obyStore.unwrap(storeUrls)]);
	React.useEffect(() => obyStore.on(storeUrls, () => setUrls([...obyStore.unwrap(storeUrls)])), []);
	return urls;
};

export const removeRepository = (url: string) => {
	const index = storeUrls.indexOf(url);
	if (index > -1) storeUrls.splice(index, 1);
};

// One card per plugin name: the same plugin can be listed by several repositories, the installed copy wins
const addEntry = (byName: Map<string, CatalogEntry>, entry: CatalogEntry) => {
	const existing = byName.get(entry.plugin.name);
	if (existing === undefined || (!existing.plugin.installed && entry.plugin.installed)) byName.set(entry.plugin.name, entry);
};

/** Repository entries plus every installed plugin (also ones installed from a plain url), one per name */
export const withInstalled = (entries: CatalogEntry[]): CatalogEntry[] => {
	const byName = new Map<string, CatalogEntry>();
	for (const entry of entries) addEntry(byName, entry);
	for (const plugin of Object.values(LunaPlugin.plugins)) {
		if (plugin.installed && !LunaPlugin.corePlugins.has(plugin.name)) addEntry(byName, { plugin });
	}
	return [...byName.values()];
};

/** All plugins from every repository, one per name */
export const useCatalog = (urls: string[]) => {
	const [repositories, setRepositories] = React.useState<Repository[]>([]);
	const [entries, setEntries] = React.useState<CatalogEntry[]>([]);
	const [loading, setLoading] = React.useState(true);
	// True once the first load finished, later reloads (a repository added or removed) keep the old grid meanwhile
	const [ready, setReady] = React.useState(false);

	React.useEffect(() => {
		let cancelled = false;
		setLoading(true);
		(async () => {
			const repos = (await Promise.all([devStoreUrl, ...urls].map(fetchRepository))).filter((repo) => repo.url !== devStoreUrl || !repo.error);
			if (cancelled) return;
			setRepositories(repos);
			const byName = new Map<string, CatalogEntry>();
			await Promise.all(
				repos.flatMap((repository) =>
					repository.plugins.map(async (entry) => {
						const plugin = await LunaPlugin.fromStorage({ url: LunaPlugin.storePluginUrl(repository.url, entry) }).catch(() => undefined);
						if (plugin !== undefined) addEntry(byName, { plugin, repository });
					}),
				),
			);
			if (cancelled) return;
			setEntries([...byName.values()]);
			setLoading(false);
			setReady(true);
		})();
		return () => {
			cancelled = true;
		};
	}, [urls]);

	return { repositories, entries, loading, ready };
};

/** Re-renders when any plugin is installed or uninstalled */
export const useInstalledVersion = () => {
	const [version, bump] = React.useReducer((x: number) => x + 1, 0);
	React.useEffect(
		() =>
			effect(() => {
				for (const plugin of Object.values(LunaPlugin.plugins)) void plugin.installed;
				bump();
			}),
		[],
	);
	return version;
};

// The Plugins tab opens with Luna Settings, so its automatic update check reuses a result younger than this
const updateCheckMaxAge = 30 * 60 * 1000;
let lastCheck: { key: string; at: number; updates: Map<string, PluginPackage> } | undefined;
/** The last check's updates if it covered the same plugins recently, minus plugins updated since */
const cachedUpdates = (key: string, installed: LunaPlugin[]) => {
	if (lastCheck === undefined || lastCheck.key !== key || Date.now() - lastCheck.at > updateCheckMaxAge) return undefined;
	const hashes = new Map(installed.map((plugin) => [plugin.url, plugin.package?.hash]));
	return new Map([...lastCheck.updates].filter(([url, remote]) => remote.hash !== hashes.get(url)));
};

/**
 * Newer packages for installed plugins, keyed by plugin url.
 * Only reads package json (hash + version), applying the update stays a user action.
 */
export const useUpdates = (entries: CatalogEntry[]) => {
	const installed = entries.filter(({ plugin }) => plugin.installed && !plugin.isDev).map(({ plugin }) => plugin);
	const latest = React.useRef(installed);
	latest.current = installed;
	// Check again only when the set of installed plugins changes, not on every catalog re-render
	const installedKey = installed.map((plugin) => plugin.url).join("\n");
	const [updates, setUpdates] = React.useState<Map<string, PluginPackage>>(() => cachedUpdates(installedKey, installed) ?? new Map());
	const [checking, setChecking] = React.useState(false);
	const run = React.useRef(0);
	const check = React.useCallback(async () => {
		const current = ++run.current;
		setChecking(true);
		const next = new Map<string, PluginPackage>();
		await Promise.all(
			latest.current.map(async (plugin) => {
				const remote = await LunaPlugin.fetchPackage(plugin.url).catch(() => undefined);
				if (remote !== undefined && remote.hash !== plugin.package?.hash) next.set(plugin.url, remote);
			}),
		);
		// A newer check started meanwhile, its result wins
		if (current !== run.current) return;
		lastCheck = { key: installedKey, at: Date.now(), updates: next };
		setUpdates(next);
		setChecking(false);
	}, [installedKey]);
	// Opening settings reuses a recent check, the button always checks again
	React.useEffect(() => {
		if (cachedUpdates(installedKey, latest.current) === undefined) void check();
	}, [check]);
	const applied = React.useCallback((url: string) => {
		lastCheck?.updates.delete(url);
		setUpdates((prev) => new Map([...prev].filter(([key]) => key !== url)));
	}, []);
	return { updates, checking, check, applied };
};

/** Urls of installed themes, kept in sync with the themes store */
export const useInstalledThemes = () => {
	const read = () => new Set(Object.keys(obyStore.unwrap(themes)));
	const [installed, setInstalled] = React.useState(read);
	React.useEffect(() => obyStore.on(themes, () => setInstalled(read())), []);
	return installed;
};
