import React from "react";

import { Signal } from "@inrixia/helpers";

import { PluginsView } from "./PluginsTab";
import { ThemesView } from "./ThemesTab";
import { useSignalValue, ViewSwitch } from "./ViewSwitch";

/** Which half of the Installed tab is shown, the old "Themes" tab id opens it on themes */
export const installedView = new Signal<"plugins" | "themes">("plugins");

const views = [
	{ value: "plugins", label: "Plugins" },
	{ value: "themes", label: "Themes" },
] as const;

/** Everything installed in one tab with a Plugins | Themes switch, like the Marketplace (the former Plugins and Themes tabs) */
export const InstalledTab = React.memo(() => {
	const view = useSignalValue(installedView);
	const switcher = <ViewSwitch label="Show" value={view} options={views} onChange={(next) => (installedView._ = next)} />;
	// Both stay mounted so switching back keeps the plugin cards (and their open dialogs) as they were
	return (
		<>
			<div hidden={view !== "plugins"} children={<PluginsView switcher={switcher} />} />
			<div hidden={view !== "themes"} children={<ThemesView switcher={switcher} />} />
		</>
	);
});
