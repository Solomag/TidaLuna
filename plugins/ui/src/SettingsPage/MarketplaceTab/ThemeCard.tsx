import React from "react";

import { addToThemes, removeTheme } from "../Storage";
import { CatalogCard, httpsImage, RepositoryChip } from "./cardParts";
import type { Theme } from "./catalog";

/** A theme listed by a repository, same layout as a plugin card */
export const ThemeCard = React.memo(
	({
		theme,
		installed,
		downloads,
		onPickRepository,
	}: {
		theme: Theme;
		installed: boolean;
		downloads?: number;
		onPickRepository: (url: string) => void;
	}) => (
		<CatalogCard
			id={theme.url}
			name={theme.name}
			title={theme.url}
			preview={httpsImage(theme.preview)}
			downloads={downloads}
			author={theme.author}
			description={theme.description}
			tags={<RepositoryChip repository={theme.repository} onPick={onPickRepository} />}
			installed={installed}
			onToggleInstall={async () => (installed ? removeTheme(theme.url) : addToThemes(theme.url, theme.name))}
		/>
	),
);
