import React from "react";

import { Signal } from "@inrixia/helpers";
import { store as obyStore } from "oby";

import { LunaPlugin, type PluginPackage } from "@luna/core";

import { storeUrls } from "../stores";

/** Local store served while developing plugins */
export const devStoreUrl = "http://127.0.0.1:3000";

export interface StorePackage extends PluginPackage {
	plugins?: string[];
}
export type StoreInfo = {
	url: string;
	pkg?: StorePackage;
	error?: string;
	/** Plugins the store lists, loaded from their package json (not installed by this) */
	plugins: LunaPlugin[];
};

const fetchStore = async (url: string): Promise<StoreInfo> => {
	try {
		// A store that never answers would keep its plugins loading forever
		const res = await fetch(`${url}/store.json`, { signal: AbortSignal.timeout(15_000) });
		if (!res.ok) throw new Error(`Failed to fetch store: ${res.statusText || res.status}`);
		const pkg: StorePackage = await res.json();
		const entries = Array.isArray(pkg.plugins) ? pkg.plugins : [];
		const plugins = await Promise.all(
			entries.map((entry) =>
				LunaPlugin.fromStorage({ url: LunaPlugin.storePluginUrl(url, entry) }).catch((err) => {
					console.warn(`[@luna/ui] Failed to load ${entry} from store ${url}:`, err);
					return undefined;
				}),
			),
		);
		return { url, pkg, plugins: plugins.filter((plugin) => plugin !== undefined) };
	} catch (err: any) {
		// The local dev store is only up while developing plugins
		if (url !== devStoreUrl) console.error(`[@luna/ui] Error fetching store ${url}:`, err);
		return { url, error: err?.message ?? String(err), plugins: [] };
	}
};

// Stores load once per session, the store's reload button fetches it again
const cache = new Map<string, Promise<StoreInfo>>();
const storesVersion = new Signal(0);
const loadStore = (url: string) => {
	let info = cache.get(url);
	if (info === undefined) cache.set(url, (info = fetchStore(url)));
	return info;
};
export const reloadStore = (url: string) => {
	cache.delete(url);
	storesVersion._ = storesVersion._ + 1;
};

/** Store urls the user has added, kept in sync with storeUrls */
export const useStoreUrls = () => {
	const [urls, setUrls] = React.useState<string[]>(() => [...obyStore.unwrap(storeUrls)]);
	React.useEffect(() => obyStore.on(storeUrls, () => setUrls([...obyStore.unwrap(storeUrls)])), []);
	return urls;
};

/** Every store (the dev store first), each shown as soon as it loaded */
export const useStores = (urls: string[]) => {
	const [version, setVersion] = React.useState(storesVersion._);
	React.useEffect(() => {
		const unload = storesVersion.onValue(setVersion);
		return () => void unload();
	}, []);
	const [loaded, setLoaded] = React.useState<ReadonlyMap<string, StoreInfo>>(new Map());
	const all = React.useMemo(() => [devStoreUrl, ...urls.filter((url) => url !== devStoreUrl)], [urls]);
	React.useEffect(() => {
		let cancelled = false;
		for (const url of all) {
			loadStore(url).then((info) => {
				if (cancelled) return;
				setLoaded((prev) => (prev.get(url) === info ? prev : new Map(prev).set(url, info)));
			});
		}
		return () => {
			cancelled = true;
		};
	}, [all, version]);
	const stores = all.map((url) => loaded.get(url)).filter((info) => info !== undefined);
	return { stores, loading: stores.length < all.length };
};
