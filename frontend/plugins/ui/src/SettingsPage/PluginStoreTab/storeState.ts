// The store list now comes from the registry (store/stores.json, Inrixia/TidaLuna#195 by
// FlazeIGuess). This module keeps the names the rest of the TidaLunar UI imports.
import { normalizeStoreUrl, visibleStores } from "./registry";

export * from "./registry";

/** Whether a store is in the visible list (registry default not hidden, or added by the user) */
export const isStoreAdded = (storeUrl: string) => {
	const url = normalizeStoreUrl(storeUrl);
	return visibleStores().some((store) => store.url === url);
};
