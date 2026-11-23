import React from "react";

import type { PluginPackage } from "@luna/core";

import { displayName } from "../names";
import { CatalogCard, httpsImage, RepositoryChip } from "./cardParts";
import { hasNative, type CatalogEntry } from "./catalog";
import { NativeChip } from "./UpdateConfirm";

export const PluginCard = React.memo(
	({
		entry,
		installed,
		downloads,
		onPickRepository,
	}: {
		entry: CatalogEntry;
		/** Passed so the memoized card re-renders on install/uninstall */
		installed: boolean;
		downloads?: number;
		onPickRepository: (url: string) => void;
	}) => {
		const { plugin, repository } = entry;
		const pkg = plugin.package;
		return (
			<CatalogCard
				id={plugin.name}
				name={displayName(plugin.name)}
				title={plugin.name}
				version={pkg?.version}
				preview={httpsImage((pkg as (PluginPackage & { preview?: unknown }) | undefined)?.preview)}
				downloads={downloads}
				author={pkg?.author}
				description={pkg?.description}
				tags={
					<>
						{/* Only the risky case gets a tag, like Spicetify's "external JS" */}
						{installed && hasNative(plugin.code) && <NativeChip native />}
						<RepositoryChip repository={repository} onPick={onPickRepository} />
					</>
				}
				installed={installed}
				uninstallHint="Uninstall (also removes its saved settings)"
				onToggleInstall={() => (installed ? plugin.uninstall() : plugin.install())}
			/>
		);
	},
);
