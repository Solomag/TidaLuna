import React from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import StorefrontIcon from "@mui/icons-material/Storefront";

import { store as obyStore } from "oby";

import { marketplaceView } from "../MarketplaceTab/catalog";
import { PageHeader } from "../PageHeader";
import { InstallFromUrl, removeTheme, themes } from "../Storage";
import { cardGridSx, emptyStateSx, softButton } from "../styles";
import { currentSettingsTab } from "../tabs";
import { LunaTheme } from "./LunaTheme";

/** Installed themes as cards. New themes come from the Marketplace, like plugins. */
export const ThemesView = React.memo(({ switcher }: { switcher: React.ReactNode }) => {
	const [_themes, setThemes] = React.useState(() => ({ ...obyStore.unwrap(themes) }));
	// Return the disposer so closing the tab stops listening
	React.useEffect(() => obyStore.on(themes, () => setThemes({ ...obyStore.unwrap(themes) })), []);
	const installed = Object.entries(_themes);
	const enabled = installed.filter(([, theme]) => theme.enabled).length;
	return (
		<Stack spacing={2.5} sx={{ paddingBottom: 4 }}>
			<PageHeader title="Installed" subtitle={`${installed.length} themes installed · ${enabled} on · Ctrl+Shift+T turns them all off`} />
			{switcher}
			<Stack direction="row" sx={{ alignItems: "center", gap: 1 }}>
				<Box sx={{ flexGrow: 1 }} children={<InstallFromUrl />} />
				<Button
					size="small"
					startIcon={<StorefrontIcon />}
					sx={softButton()}
					onClick={() => {
						marketplaceView._ = "themes";
						currentSettingsTab._ = "Marketplace";
					}}
					children="Browse themes"
				/>
			</Stack>
			{!installed.length && (
				<Typography
					role="status"
					variant="body2"
					sx={emptyStateSx}
					children="No themes installed. Browse the Marketplace or paste a .css url above."
				/>
			)}
			<Box sx={cardGridSx}>
				{installed.map(([url, theme]) => (
					<LunaTheme theme={theme} key={url} url={url} uninstall={() => removeTheme(url)} />
				))}
			</Box>
		</Stack>
	);
});
