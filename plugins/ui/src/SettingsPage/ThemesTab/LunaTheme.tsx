import React from "react";

import ListItemIcon from "@mui/material/ListItemIcon";
import MenuItem from "@mui/material/MenuItem";

import CachedIcon from "@mui/icons-material/Cached";

import type { LunaAuthor } from "@luna/core";
import type { VoidFn } from "@inrixia/helpers";
import { ftch } from "@luna/core";
import { StyleTag } from "@luna/lib";
import { LunaLink } from "../../components";
import { unloads } from "../../index.safe";
import { CardShell, previewImage } from "../MarketplaceTab/cardParts";
import { CardActions, UninstallMenuItem } from "../PluginsTab/CardActions";
import { themes, themeStyles } from "../Storage";

export type LunaThemeStorage = {
	enabled: boolean;
	css?: string;
	/** From the repository listing it was installed from */
	name?: string;
	description?: string;
	author?: LunaAuthor | string;
	preview?: string;
};

type LunaThemeManifest = { name?: string; description?: string; author?: string };
// Neptune themes can start with a JSON manifest in a comment, most themes have none
const parseManifest = (css?: string): LunaThemeManifest | undefined => {
	if (css === undefined) return undefined;
	try {
		return JSON.parse(css.slice(css.indexOf("/*") + 2, css.indexOf("*/")));
	} catch {
		return undefined;
	}
};

/** Last path segment of the url without query or hash, the whole url when there is none */
const fileName = (url: string) => {
	const path = URL.parse(url)?.pathname ?? url;
	return path.slice(path.lastIndexOf("/") + 1) || url;
};

/** Installed theme, same card as in the Marketplace: on/off switch, reload and uninstall in the menu */
export const LunaTheme = React.memo(({ theme, url, uninstall }: { theme: LunaThemeStorage; url: string; uninstall: VoidFn }) => {
	const [enabled, setEnabled] = React.useState(theme.enabled);
	// Sync enabled state when prop changes (e.g., emergency disable shortcut)
	React.useEffect(() => setEnabled(theme.enabled), [theme.enabled]);
	const [css, setCSS] = React.useState(theme.css);
	const [loading, setLoading] = React.useState(false);
	const [themeStyle] = React.useState(() => themeStyles[url] ?? (themeStyles[url] = new StyleTag(url, unloads)));
	// Neptune theme manifest support
	const [manifest, setManifest] = React.useState(() => parseManifest(theme.css));
	// No manifest: the repository listing, then the css file name (reads better than the whole url)
	const name = manifest?.name ?? theme.name ?? fileName(url);

	const toggleEnabled = React.useCallback((_: unknown, checked: boolean) => {
		setEnabled((themes[url].enabled = checked));
		themeStyle.css = checked ? themes[url].css : undefined;
	}, []);
	const loadCSS = React.useCallback(async () => {
		setLoading(true);
		try {
			const css = (themes[url].css = await ftch.text(url));
			setCSS(css);
			// Reloading an enabled theme has to restyle the page, not only update what is stored
			if (themes[url]?.enabled) themeStyle.css = css;
			setManifest(parseManifest(css));
		} finally {
			setLoading(false);
		}
	}, []);

	React.useEffect(() => {
		if (themes[url]?.enabled) {
			if (css === undefined) loadCSS();
			else themeStyle.css = css;
		}
	}, []);

	return (
		<CardShell
			id={url}
			idAttribute="data-luna-theme-card"
			name={<LunaLink href={url} children={name} />}
			title={url}
			preview={previewImage(theme.preview)}
			author={manifest?.author ?? theme.author}
			description={manifest?.description ?? theme.description ?? fileName(url)}
			actions={
				<CardActions
					name={name}
					enabled={enabled}
					loading={loading}
					onToggle={toggleEnabled}
					menu={(close) => [
						<MenuItem
							key="reload"
							disabled={loading}
							onClick={() => {
								close();
								void loadCSS();
							}}
						>
							<ListItemIcon children={<CachedIcon fontSize="small" />} />
							Reload theme
						</MenuItem>,
						<UninstallMenuItem key="uninstall" label="Uninstall theme" onClick={() => (close(), uninstall())} />,
					]}
				/>
			}
		/>
	);
});
