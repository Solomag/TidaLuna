import React from "react";

import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";

import { LunaSwitch, LunaTrashButton, SpinningButton } from "../../components";

import type { VoidFn } from "@inrixia/helpers";
import { ftch } from "@luna/core";
import { StyleTag } from "@luna/lib";
import { unloads } from "../../index.safe";
import { LunaPluginHeader } from "../PluginsTab/LunaPluginHeader";
import { themes, themeStyles } from "../Storage";
import { cardSx } from "../styles";

export type LunaThemeStorage = {
	enabled: boolean;
	css?: string;
	/** Name from the repository listing it was installed from */
	name?: string;
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

export const LunaTheme = React.memo(({ theme, url, uninstall }: { theme: LunaThemeStorage; url: string; uninstall: VoidFn }) => {
	const [enabled, setEnabled] = React.useState(theme.enabled);
	// Sync enabled state when prop changes (e.g., emergency disable shortcut)
	React.useEffect(() => setEnabled(theme.enabled), [theme.enabled]);
	const [css, setCSS] = React.useState(theme.css);
	const [loading, setLoading] = React.useState(false);
	const [themeStyle] = React.useState(() => themeStyles[url] ?? (themeStyles[url] = new StyleTag(url, unloads)));
	// Neptune theme manifest support
	const [manifest, setManifest] = React.useState(() => parseManifest(theme.css));
	// No manifest: the css file name reads better than the whole url
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
		<Stack spacing={1} data-luna-theme-card={url} sx={{ ...cardSx, paddingTop: 1.25, paddingBottom: 1.25 }}>
			<LunaPluginHeader
				name={name}
				desc={manifest?.description}
				author={manifest?.author}
				link={url}
				children={
					<>
						<Tooltip
							title={enabled ? `Disable ${name}` : `Enable ${name}`}
							children={<LunaSwitch checked={enabled} loading={loading} onChange={toggleEnabled} />}
						/>
						<SpinningButton title="Reload theme" spin={loading} disabled={loading} onClick={loadCSS} />
						<LunaTrashButton title="Uninstall theme" onClick={uninstall} />
					</>
				}
			/>
		</Stack>
	);
});
