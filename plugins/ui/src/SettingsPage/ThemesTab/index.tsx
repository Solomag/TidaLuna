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
import { softButton } from "../styles";
import { currentSettingsTab } from "../tabs";
import { LunaTheme } from "./LunaTheme";

/** Installed themes (the library). New themes come from the Marketplace, like plugins. */
export const ThemesTab = React.memo(() => {
	const [_themes, setThemes] = React.useState(() => ({ ...obyStore.unwrap(themes) }));
	// Return the disposer so closing the tab stops listening
	React.useEffect(() => obyStore.on(themes, () => setThemes({ ...obyStore.unwrap(themes) })), []);
	const installed = Object.entries(_themes);
	const enabled = installed.filter(([, theme]) => theme.enabled).length;
	return (
		<Stack spacing={2.5} sx={{ paddingBottom: 4 }}>
			<Stack direction="row" sx={{ alignItems: "flex-end", gap: 2 }}>
				<Box sx={{ flexGrow: 1, minWidth: 0 }}>
					<PageHeader title="Themes" subtitle={`${installed.length} installed · ${enabled} on · Ctrl+Shift+T turns them all off`} />
				</Box>
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
			<Box sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2, backgroundColor: "rgba(255, 255, 255, 0.08)" } }} children={<InstallFromUrl />} />
			{!installed.length && (
				<Typography role="status" variant="body2" sx={{ color: "text.secondary", paddingY: 4, textAlign: "center" }}>
					No themes installed. Browse the Marketplace or paste a .css url above.
				</Typography>
			)}
			<Stack spacing={1.5}>
				{installed.map(([url, theme]) => (
					<LunaTheme theme={theme} key={url} url={url} uninstall={() => removeTheme(url)} />
				))}
			</Stack>
		</Stack>
	);
});
