import { effect } from "oby";

const byName = new Intl.Collator(undefined, { sensitivity: "base" });

export function installedPlugins<T extends { installed: boolean; name: string }>(plugins: T[], core: ReadonlySet<string>, descending: boolean) {
	return plugins
		.filter((plugin) => plugin.installed && !core.has(plugin.name))
		.sort((a, b) => (descending ? byName.compare(b.name, a.name) : byName.compare(a.name, b.name)));
}

export function matchingPluginNames<T extends { name: string }>(plugins: T[], query: string) {
	const search = query.trim().toLocaleLowerCase();
	return new Set(plugins.filter((plugin) => plugin.name.toLocaleLowerCase().includes(search)));
}

export function watchInstalledPlugins<T extends { installed: boolean; name: string }>(
	registry: Record<string, T>,
	core: ReadonlySet<string>,
	descending: boolean,
	update: (plugins: T[]) => void,
) {
	// Track registry membership as well as install flags, including when the tab first opens empty.
	return effect(() => update(installedPlugins(Object.values(registry), core, descending)), { sync: true });
}

/**
 * Plugins listed by stores that aren't installed, one card per plugin no matter how many stores list it.
 * A plugin whose name is installed (from any url) is left out, [DEV] copies stay separate from released ones.
 */
export function availablePlugins<T extends { installed: boolean; name: string; isDev: boolean }>(
	listed: T[],
	installed: T[],
	core: ReadonlySet<string>,
	descending: boolean,
) {
	const installedNames = new Set(installed.map((plugin) => plugin.name));
	const byKey = new Map<string, T>();
	for (const plugin of listed) {
		if (plugin.installed || core.has(plugin.name) || installedNames.has(plugin.name)) continue;
		const key = `${plugin.isDev ? "dev:" : ""}${plugin.name}`;
		if (!byKey.has(key)) byKey.set(key, plugin);
	}
	return [...byKey.values()].sort((a, b) => (descending ? byName.compare(b.name, a.name) : byName.compare(a.name, b.name)));
}
