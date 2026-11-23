import React from "react";

import Stack from "@mui/material/Stack";

import { LunaTrashButton, SpinningButton } from "../../components";
import { removeStore } from "../stores";
import { devStoreUrl, reloadStore, type StoreInfo } from "./catalog";
import { LunaPluginHeader } from "./LunaPluginHeader";

/** A store in the Stores list, its plugins are shown with all others in the Plugins tab */
export const LunaStore = React.memo(({ store }: { store: StoreInfo }) => {
	const [reloading, setReloading] = React.useState(false);
	// A reload finishes when the hook hands over the newly fetched store
	React.useEffect(() => setReloading(false), [store]);

	const { url, pkg, error } = store;
	const isLocalDevStore = url === devStoreUrl;

	let name = pkg?.name ?? "Unknown Store";
	if (isLocalDevStore) name = `${name} [DEV]`;
	const count = store.plugins.length;

	return (
		<Stack
			sx={{
				borderRadius: 3,
				backgroundColor: "rgba(0, 0, 0, 0.10)",
				boxShadow: error ? "0 0 10px rgba(255, 0, 0, 0.70)" : "none",
				padding: 2,
				paddingTop: 1,
				paddingBottom: 1,
			}}
		>
			<LunaPluginHeader
				name={name}
				version={error ? undefined : `${count} plugin${count === 1 ? "" : "s"}`}
				link={pkg?.homepage ?? pkg?.repository?.url ?? url}
				loadError={error}
				author={pkg?.author}
				desc={pkg?.description}
				children={
					<>
						<SpinningButton
							title="Reload store"
							spin={reloading}
							disabled={reloading}
							onClick={() => {
								setReloading(true);
								reloadStore(url);
							}}
						/>
						<LunaTrashButton disabled={isLocalDevStore} title="Remove store" onClick={() => removeStore(url)} />
					</>
				}
			/>
		</Stack>
	);
});
