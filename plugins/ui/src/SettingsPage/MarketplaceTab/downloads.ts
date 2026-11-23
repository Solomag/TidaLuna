import React from "react";

import { LunaPlugin, ReactiveStore } from "@luna/core";

import type { Repository } from "./catalog";

/**
 * Download counts of plugin builds, read from the GitHub release a store is published in
 * (`github.com/<owner>/<repo>/releases/download/<tag>` or `.../releases/latest/download`).
 * Only used to sort and pick popular plugins, the numbers aren't shown (see Inrixia/TidaLuna#197).
 */
const releaseApiUrl = (storeUrl: string): string | undefined => {
	const url = URL.parse(storeUrl);
	if (url?.hostname !== "github.com") return;
	const [owner, repo, releases, ...rest] = url.pathname.split("/").filter(Boolean);
	if (!owner || !repo || releases !== "releases") return;
	const base = `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/releases`;
	if (rest[0] === "download" && rest[1]) return `${base}/tags/${encodeURIComponent(rest[1])}`;
	if (rest[0] === "latest" && rest[1] === "download") return `${base}/latest`;
};

// The GitHub API allows 60 unauthenticated requests an hour, so counts are kept for 6 hours across restarts
const maxAge = 6 * 60 * 60 * 1000;
const cache = ReactiveStore.getStore("@luna/marketplaceDownloads");
type Cached = { at: number; counts: Record<string, number> };
const releases = new Map<string, Promise<Map<string, number>>>();
const fetchAssetDownloads = (storeUrl: string) => {
	let counts = releases.get(storeUrl);
	if (counts === undefined) {
		const apiUrl = releaseApiUrl(storeUrl);
		counts = (async () => {
			if (apiUrl === undefined) return new Map<string, number>();
			const cached = await cache.get<Cached>(storeUrl).catch(() => undefined);
			if (cached !== undefined && Date.now() - cached.at < maxAge) return new Map(Object.entries(cached.counts));
			const res = await fetch(apiUrl).catch(() => undefined);
			// Rate limited or offline: keep showing the last known counts
			if (!res?.ok) {
				releases.delete(storeUrl);
				return new Map(Object.entries(cached?.counts ?? {}));
			}
			const release: { assets?: { name?: string; download_count?: number }[] } = await res.json().catch(() => ({}));
			const byAsset: Record<string, number> = {};
			for (const asset of release.assets ?? []) {
				if (asset.name?.endsWith(".mjs") && typeof asset.download_count === "number") byAsset[asset.name.toLowerCase()] = asset.download_count;
			}
			await cache.set<Cached>(storeUrl, { at: Date.now(), counts: byAsset }).catch(() => undefined);
			return new Map(Object.entries(byAsset));
		})();
		releases.set(storeUrl, counts);
	}
	return counts;
};

/** Download count per plugin url, for plugins listed in GitHub release stores */
export const useDownloads = (repositories: Repository[]) => {
	const [downloads, setDownloads] = React.useState<Map<string, number>>(new Map());
	React.useEffect(() => {
		let cancelled = false;
		(async () => {
			const next = new Map<string, number>();
			await Promise.all(
				repositories.map(async (repository) => {
					const byAsset = await fetchAssetDownloads(repository.url);
					for (const entry of repository.plugins) {
						// Same url fromStorage keeps: some stores list "<name>.mjs"
						const url = LunaPlugin.storePluginUrl(repository.url, entry).replace(/(\.mjs|\.json|\.mjs\.map)$/, "");
						const count = byAsset.get(`${url.slice(url.lastIndexOf("/") + 1)}.mjs`.toLowerCase());
						if (count !== undefined) next.set(url, count);
					}
				}),
			);
			if (!cancelled) setDownloads(next);
		})();
		return () => {
			cancelled = true;
		};
	}, [repositories]);
	return downloads;
};
