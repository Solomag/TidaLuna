import Stack from "@mui/material/Stack";
import React from "react";

import { LunaSettings } from "../../components";

import { LunaPlugin } from "@luna/core";
import { PageHeader } from "../PageHeader";
import { LunaPluginSettings } from "../PluginsTab/LunaPluginSettings";
import { sectionCardsSx } from "../styles";
import { LunaCacheSettings } from "./LunaCacheSettings";
import { LunaFeatureFlags } from "./LunaFeatureFlags";
import { LunaNativePermissions } from "./LunaNativePermissions";
import { LunaSettingsTransfer } from "./LunaSettingsTransfer";
import { LunaShortcuts } from "./LunaShortcuts";
import { LunaVersionInfo } from "./LunaVersionInfo";

export const SettingsTab = React.memo(() => {
	const corePlugins = [];
	for (const plugin of Object.values(LunaPlugin.plugins)) {
		if (!LunaPlugin.corePlugins.has(plugin.name)) continue;
		corePlugins.push(<LunaPluginSettings key={plugin.url} plugin={plugin} />);
	}
	return (
		<Stack spacing={2} sx={{ paddingBottom: 4, ...sectionCardsSx }}>
			<PageHeader title="Settings" subtitle="TIDALuna itself: version, backups, cache, shortcuts, permissions and core plugins" />
			<LunaVersionInfo />
			<LunaSettingsTransfer />
			<LunaCacheSettings />
			<LunaShortcuts />
			<LunaNativePermissions />
			<LunaFeatureFlags />
			<LunaSettings title="Luna core plugins" desc="Plugins providing core luna functionality" spacing={1.5}>
				{corePlugins}
			</LunaSettings>
		</Stack>
	);
});
