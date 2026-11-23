import React from "react";

import { effect, store as obyStore } from "oby";

import { LunaPlugin, type LunaAuthor, type PluginPackage } from "@luna/core";

import { storeUrls } from "../PluginStoreTab";

export const devStoreUrl = "http://127.0.0.1:3000";

export type Repository = {
	url: string;
	name?: string;
	author?: LunaAuthor | string;
	plugins: string[];
	error?: string;
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
		const res = await fetch(`${url}/store.json`);
		if (!res.ok) throw new Error(res.statusText || `HTTP ${res.status}`);
		const pkg: PluginPackage & { plugins?: string[] } = await res.json();
		return { url, name: pkg.name, author: pkg.author, plugins: pkg.plugins ?? [] };
	} catch (err: any) {
		return { url, plugins: [], error: err?.message ?? String(err) };
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

/** All plugins from every repository plus installed ones, deduped by url */
export const useCatalog = (urls: string[]) => {
	const [repositories, setRepositories] = React.useState<Repository[]>([]);
	const [entries, setEntries] = React.useState<CatalogEntry[]>([]);
	const [loading, setLoading] = React.useState(true);

	React.useEffect(() => {
		let cancelled = false;
		setLoading(true);
		(async () => {
			const repos = (await Promise.all([devStoreUrl, ...urls].map(fetchRepository))).filter((repo) => repo.url !== devStoreUrl || !repo.error);
			if (cancelled) return;
			setRepositories(repos);
			// One card per plugin name: the same plugin can be listed by several repositories, the installed copy wins
			const byName = new Map<string, CatalogEntry>();
			const add = (entry: CatalogEntry) => {
				const existing = byName.get(entry.plugin.name);
				if (existing === undefined || (!existing.plugin.installed && entry.plugin.installed)) byName.set(entry.plugin.name, entry);
			};
			await Promise.all(
				repos.flatMap((repository) =>
					repository.plugins.map(async (entry) => {
						const plugin = await LunaPlugin.fromStorage({ url: LunaPlugin.storePluginUrl(repository.url, entry) }).catch(() => undefined);
						if (plugin !== undefined) add({ plugin, repository });
					}),
				),
			);
			// Installed from a plain url, not listed in any repository
			for (const plugin of Object.values(LunaPlugin.plugins)) {
				if (plugin.installed && !LunaPlugin.corePlugins.has(plugin.name)) add({ plugin });
			}
			if (cancelled) return;
			setEntries([...byName.values()]);
			setLoading(false);
		})();
		return () => {
			cancelled = true;
		};
	}, [urls]);

	return { repositories, entries, loading };
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

/**
 * Newer packages for installed plugins, keyed by plugin url.
 * Only reads package json (hash + version), applying the update stays a user action.
 */
export const useUpdates = (entries: CatalogEntry[]) => {
	const [updates, setUpdates] = React.useState<Map<string, PluginPackage>>(new Map());
	const [checking, setChecking] = React.useState(false);
	const check = React.useCallback(async () => {
		setChecking(true);
		const next = new Map<string, PluginPackage>();
		await Promise.all(
			entries
				.filter(({ plugin }) => plugin.installed && !plugin.isDev)
				.map(async ({ plugin }) => {
					const remote = await LunaPlugin.fetchPackage(plugin.url).catch(() => undefined);
					if (remote !== undefined && remote.hash !== plugin.package?.hash) next.set(plugin.url, remote);
				}),
		);
		setUpdates(next);
		setChecking(false);
	}, [entries]);
	React.useEffect(() => void check(), [check]);
	const applied = React.useCallback((url: string) => setUpdates((prev) => new Map([...prev].filter(([key]) => key !== url))), []);
	return { updates, checking, check, applied };
};
