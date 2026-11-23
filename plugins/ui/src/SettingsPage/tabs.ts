import type { LunaUnload, LunaUnloads } from "@luna/core";
import { Signal } from "@inrixia/helpers";
import type React from "react";

export type SettingsTabProps = { active: boolean };
export type SettingsTabContent = React.ReactNode | React.ComponentType<SettingsTabProps>;

export interface SettingsTab {
	/**
	 * Unique id, also the value of the tab. Built-in ids: "Plugins" (shown as Installed), "Marketplace", "Settings", "Supporters".
	 * Old ids still open their tab: "Plugin Store" → Marketplace, "Themes" → Installed on its Themes view.
	 */
	id: string;
	label: string;
	icon?: React.ReactElement;
	/** Tabs are sorted by order, built-in tabs use 100, 200, 300... */
	order: number;
	content: SettingsTabContent;
	/** Keep the tab mounted (hidden) after it was first opened instead of unmounting it on every switch */
	keepAlive?: boolean;
	hidden?: boolean;
}
export type SettingsTabOverride = Partial<Omit<SettingsTab, "id">>;

const tabs = new Map<string, SettingsTab>();
const overrides: { id: string; override: SettingsTabOverride }[] = [];

/** Bumped whenever tabs or overrides change */
export const settingsTabsVersion = new Signal(0);
const changed = () => (settingsTabsVersion._ = settingsTabsVersion._ + 1);

/** Currently selected Luna Settings tab id */
export const currentSettingsTab = new Signal<string>("Plugins");

type TabAlias = {
	/** Tab that took over the old id */
	id: string;
	/** Shows the part of that tab the old id stood for, e.g. its Themes view */
	open?: () => void;
	/** The old tab was merged into a bigger one: overriding (hiding, replacing) the old id must not change the whole new tab */
	merged?: boolean;
};
/** Ids of built-in tabs that were renamed or merged, so plugins using the old id keep working (unless a plugin registered a tab with that id) */
const tabAliases = new Map<string, TabAlias>();
/** Internal, used by @luna/ui for its built-in tabs */
export const addTabAlias = (oldId: string, alias: TabAlias) => tabAliases.set(oldId, alias);
const aliasOf = (id: string) => (tabs.has(id) ? undefined : tabAliases.get(id));
export const resolveTabId = (id: string) => aliasOf(id)?.id ?? id;
/** Opening an old id: show the matching view of the tab that replaced it */
export const openAlias = (id: string) => aliasOf(id)?.open?.();

/** Internal, used by @luna/ui for its built-in tabs */
export const addBuiltInSettingsTab = (tab: SettingsTab) => tabs.set(tab.id, tab);

export const SettingsTabs = {
	/**
	 * Add a new tab to Luna Settings. Removed again when unloads run.
	 */
	register(unloads: LunaUnloads, tab: SettingsTab) {
		if (tabs.has(tab.id)) throw new Error(`Settings tab "${tab.id}" is already registered`);
		tabs.set(tab.id, tab);
		changed();
		unloads.add(() => {
			if (tabs.get(tab.id) !== tab) return;
			tabs.delete(tab.id);
			changed();
		});
	},
	/**
	 * Change an existing tab (built-in or registered), e.g. replace its content, hide it or move it.
	 * Later overrides win. Reverted when unloads run.
	 */
	override(unloads: LunaUnloads, id: string, override: SettingsTabOverride) {
		if (aliasOf(id)?.merged) {
			console.warn(`[Luna] Settings tab "${id}" is now part of "${resolveTabId(id)}", the override is ignored`);
			return;
		}
		const entry = { id: resolveTabId(id), override };
		overrides.push(entry);
		changed();
		unloads.add(() => {
			const index = overrides.indexOf(entry);
			if (index === -1) return;
			overrides.splice(index, 1);
			changed();
		});
	},
	/** All tabs with overrides applied, sorted by order. Includes hidden tabs. */
	list(): SettingsTab[] {
		const resolved = [...tabs.values()].map((tab) => {
			let next = tab;
			for (const { id, override } of overrides) if (id === tab.id) next = { ...next, ...override, id: tab.id };
			return next;
		});
		return resolved.sort((a, b) => a.order - b.order);
	},
	get current() {
		return currentSettingsTab._;
	},
	/** Switch Luna Settings to the given tab */
	open(id: string) {
		openAlias(id);
		currentSettingsTab._ = resolveTabId(id);
	},
	/** Called with the tab id whenever the selected tab changes. Removed again when unloads run. */
	onChange(unloads: LunaUnloads, cb: (id: string) => unknown): LunaUnload {
		const unload: LunaUnload = currentSettingsTab.onValue(cb);
		unloads.add(unload);
		return unload;
	},
	/** Called whenever tabs or overrides change. Removed again when unloads run. */
	onUpdate(unloads: LunaUnloads, cb: () => unknown): LunaUnload {
		const unload: LunaUnload = settingsTabsVersion.onValue(() => cb());
		unloads.add(unload);
		return unload;
	},
};
