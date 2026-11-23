import React from "react";

import { addToThemes, removeTheme } from "../Storage";
import { CatalogCard, previewImage, RepositoryChip } from "./cardParts";
import type { Theme } from "./catalog";

/** A theme listed by a repository, same layout as a plugin card */
export const ThemeCard = React.memo(
	({
		theme,
		installed,
		downloads,
		repositoryActive,
		onPickRepository,
	}: {
		theme: Theme;
		installed: boolean;
		downloads?: number;
		repositoryActive: boolean;
		onPickRepository: (url: string) => void;
	}) => {
		const preview = previewImage(theme.preview);
		return (
			<CatalogCard
				id={theme.url}
				name={theme.name}
				title={theme.url}
				preview={preview}
				downloads={downloads}
				author={theme.author}
				description={theme.description}
				tags={<RepositoryChip repository={theme.repository} active={repositoryActive} onPick={onPickRepository} />}
				installed={installed}
				onToggleInstall={async () =>
					installed
						? removeTheme(theme.url)
						: addToThemes(theme.url, { name: theme.name, description: theme.description, author: theme.author, preview })
				}
			/>
		);
	},
);
