import { LunaPlugin, ReactiveStore } from "@luna/core";

/** Plugin repositories (store.json urls) the user has added */
const pluginStores = ReactiveStore.getStore("@luna/pluginStores");
export const storeUrls = await pluginStores.getReactive<string[]>("storeUrls", []);
export const addToStores = (url: string) => {
	url = LunaPlugin.normalizeStoreUrl(url);
	if (storeUrls.includes(url)) return false;
	return storeUrls.push(url);
};

// Swaps old store urls for the new one <3 (call addToStores after to add)
export const replaceStore = async (legacyUrls: string[], newUrl: string) => {
	newUrl = LunaPlugin.normalizeStoreUrl(newUrl);
	// Ignore case.. tidaluna:// links lowercase urls <3
	const legacy = new Set(legacyUrls.map((url) => LunaPlugin.normalizeStoreUrl(url).toLowerCase()));
	for (const legacyUrl of legacy) await LunaPlugin.migrateBaseUrl(legacyUrl, newUrl);
	for (let i = 0; i < storeUrls.length; i++) {
		if (!legacy.has(LunaPlugin.normalizeStoreUrl(storeUrls[i]).toLowerCase())) continue;
		if (storeUrls.includes(newUrl)) storeUrls.splice(i--, 1);
		else storeUrls[i] = newUrl;
	}
};

// Devs! Add your stores here <3
// Store moved? replaceStore then addToStores <3
// TODO: Abstract this to a git repo
addToStores("https://github.com/SuperslowJelly/TIDAL-Clear-Coat/releases/download/latest/store.json");
await replaceStore(
	["https://github.com/meowarex/TidalLuna-Plugins/releases/download/latest/store.json"],
	"https://release.radiant-lyrics.org/store.json",
);
addToStores("https://release.radiant-lyrics.org/store.json");
addToStores("https://github.com/wont-stream/lunar/releases/download/dev/store.json");
addToStores("https://github.com/jxnxsdev/luna-plugins/releases/download/latest/store.json");
addToStores("https://github.com/espeon/luna-plugins/releases/download/latest/store.json");
addToStores("https://github.com/Inrixia/luna-plugins/releases/download/dev/store.json");
addToStores("https://github.com/Aztup/luna-plugins/releases/download/latest/store.json");
addToStores("https://github.com/vMohammad24/luna-plugins/releases/download/latest/store.json");
addToStores("https://github.com/MathDesigns/luna-plugins/releases/download/latest/store.json");
addToStores("https://github.com/otomir23/luna-plugins/releases/download/latest/store.json");
addToStores("https://github.com/dantraynor/lunaplugins/releases/download/latest/store.json");
addToStores("https://github.com/Akasiek/tidaluna-plugins/releases/download/latest/store.json");
addToStores("https://github.com/Foukapik/TidaLuna-Plugins/releases/download/latest/store.json");
addToStores("https://github.com/Renskursa/tidaluna-plugins/releases/download/latest/store.json");
addToStores("https://github.com/Henr1ES/TidalLunaPlugins/releases/download/latest/store.json");
addToStores("https://github.com/SinnerK0N/tidaluna-plugins/releases/download/latest/store.json");
addToStores("https://github.com/squadgazzz/luna-plugins/releases/download/latest/store.json");
addToStores("https://github.com/minseokk7/luna-plugins/releases/download/latest/store.json");
addToStores("https://github.com/FireWall-code/TidaLuna-Plugins/releases/download/latest/store.json");
addToStores("https://github.com/FlazeIGuess/tidaluna-plugins/releases/download/latest/store.json");
addToStores("https://github.com/seomin0610/luna-plugins/releases/download/latest/store.json");
addToStores("https://github.com/visiuun/tidaluna-plugins/releases/download/latest/store.json");
addToStores("https://github.com/Kisakay/luna-plugins/releases/download/latest/store.json");
addToStores("https://github.com/BaeHyolyn/luna-plugins/releases/latest/download/store.json");
addToStores("https://github.com/Drousis3/Tidaluna-nice-to-have-plugins/releases/download/latest/store.json");
addToStores("https://github.com/pimull/tidaluna-album-editions/releases/latest/download/store.json");
addToStores("https://github.com/Solomag/lunatic-ui/releases/download/latest/store.json");
addToStores("https://github.com/Fuchs-Fox/lunajam/releases/download/latest/store.json");

export const { normalizeStoreUrl } = LunaPlugin;
