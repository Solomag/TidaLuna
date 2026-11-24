import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import React from "react";

import { Signal } from "@inrixia/helpers";

import { LunaPlugin } from "@luna/core";
import { PageHeader } from "../PageHeader";
import { InstalledPluginCard } from "../PluginsTab/InstalledPluginCard";
import { cardGridSx } from "../styles";
import { useSignalValue, ViewSwitch } from "../ViewSwitch";
import { LunaCacheSettings } from "./LunaCacheSettings";
import { LunaFeatureFlags } from "./LunaFeatureFlags";
import { LunaNativePermissions } from "./LunaNativePermissions";
import { LunaSettingsTransfer } from "./LunaSettingsTransfer";
import { LunaShortcuts } from "./LunaShortcuts";
import { LunaVersionInfo } from "./LunaVersionInfo";

/** Which part of the Settings tab is shown */
export const settingsView = new Signal<"general" | "flags" | "permissions">("general");

const views = [
	{ value: "general", label: "General" },
	{ value: "flags", label: "Feature flags" },
	{ value: "permissions", label: "Native permissions" },
] as const;

export const SettingsTab = React.memo(() => {
	const view = useSignalValue(settingsView);
	const switcher = <ViewSwitch label="Show" value={view} options={views} onChange={(next) => (settingsView._ = next)} />;

	const corePlugins = Object.values(LunaPlugin.plugins).filter((plugin) => LunaPlugin.corePlugins.has(plugin.name));
	// General and flags stay mounted so switching back doesn't refetch releases or lose the picked version
	return (
		<>
			<div hidden={view !== "general"}>
				<Stack spacing={4} sx={{ paddingBottom: 4 }}>
					<PageHeader title="Settings" subtitle="TIDALuna itself: version, shortcuts, core plugins, cache and backups" />
					{switcher}
					<LunaVersionInfo />
					<LunaShortcuts />
					{/* Same cards as in the Installed tab, without the switch and Uninstall */}
					<Stack component="section" spacing={1.5} data-luna-core-plugins>
						<Stack spacing={0.25}>
							<Typography variant="h7" component="h2" children="Luna core plugins" />
							<Typography variant="subtitle2" children="Plugins providing core Luna functionality, always on" />
						</Stack>
						<Box sx={cardGridSx}>
							{corePlugins.map((plugin) => (
								<InstalledPluginCard key={plugin.url} plugin={plugin} core />
							))}
						</Box>
					</Stack>
					{/* Rarely needed, so last */}
					<LunaCacheSettings />
					<LunaSettingsTransfer />
				</Stack>
			</div>
			<div hidden={view !== "flags"} children={<LunaFeatureFlags switcher={switcher} />} />
			{/* Mounted when shown, so answers given since (a plugin installed meanwhile) are listed */}
			{view === "permissions" && <LunaNativePermissions switcher={switcher} />}
		</>
	);
});
