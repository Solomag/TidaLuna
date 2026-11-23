import Stack from "@mui/material/Stack";
import React from "react";

import { Signal } from "@inrixia/helpers";

import { LunaSettings } from "../../components";

import { LunaPlugin } from "@luna/core";
import { PageHeader } from "../PageHeader";
import { LunaPluginSettings } from "../PluginsTab/LunaPluginSettings";
import { sectionCardsSx } from "../styles";
import { useSignalValue, ViewSwitch } from "../ViewSwitch";
import { LunaCacheSettings } from "./LunaCacheSettings";
import { LunaFeatureFlags } from "./LunaFeatureFlags";
import { LunaNativePermissions } from "./LunaNativePermissions";
import { LunaSettingsTransfer } from "./LunaSettingsTransfer";
import { LunaShortcuts } from "./LunaShortcuts";
import { LunaVersionInfo } from "./LunaVersionInfo";

/** Which part of the Settings tab is shown */
export const settingsView = new Signal<"general" | "flags">("general");

const views = [
	{ value: "general", label: "General" },
	{ value: "flags", label: "Feature flags" },
] as const;

export const SettingsTab = React.memo(() => {
	const view = useSignalValue(settingsView);
	const switcher = <ViewSwitch label="Show" value={view} options={views} onChange={(next) => (settingsView._ = next)} />;

	const corePlugins = [];
	for (const plugin of Object.values(LunaPlugin.plugins)) {
		if (!LunaPlugin.corePlugins.has(plugin.name)) continue;
		corePlugins.push(<LunaPluginSettings key={plugin.url} plugin={plugin} />);
	}
	// Both stay mounted so switching back doesn't refetch releases or lose the picked version
	return (
		<>
			<div hidden={view !== "general"}>
				<Stack spacing={2} sx={{ paddingBottom: 4, ...sectionCardsSx }}>
					<PageHeader title="Settings" subtitle="TIDALuna itself: version, backups, cache, shortcuts, permissions and core plugins" />
					{switcher}
					<LunaVersionInfo />
					<LunaSettingsTransfer />
					<LunaCacheSettings />
					<LunaShortcuts />
					<LunaNativePermissions />
					<LunaSettings title="Luna core plugins" desc="Plugins providing core luna functionality" spacing={1.5}>
						{corePlugins}
					</LunaSettings>
				</Stack>
			</div>
			<div hidden={view !== "flags"} children={<LunaFeatureFlags switcher={switcher} />} />
		</>
	);
});
