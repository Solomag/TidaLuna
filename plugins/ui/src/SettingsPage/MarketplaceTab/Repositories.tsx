import React from "react";

import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { LunaTrashButton } from "../../components";
import { InstallFromUrl } from "../PluginStoreTab/InstallFromUrl";
import { devStoreUrl, removeRepository, type Repository } from "./catalog";

/** Former "stores": a repository is a store.json listing plugins */
export const Repositories = React.memo(({ repositories }: { repositories: Repository[] }) => (
	<Stack spacing={1} sx={{ padding: 1.5, borderRadius: 2, backgroundColor: "rgba(0, 0, 0, 0.15)" }}>
		<InstallFromUrl />
		{repositories.map((repo) => (
			<Stack key={repo.url} direction="row" spacing={1} sx={{ alignItems: "center" }}>
				<Stack sx={{ flexGrow: 1, minWidth: 0 }}>
					<Typography variant="body2" sx={{ fontWeight: 500 }}>
						{repo.name ?? "Unknown repository"}
						{repo.url === devStoreUrl && " [DEV]"}
						<Typography component="span" variant="caption" sx={{ opacity: 0.6, marginLeft: 1 }}>
							{repo.error ? `failed: ${repo.error}` : `${repo.plugins.length} plugins`}
						</Typography>
					</Typography>
					<Typography
						variant="caption"
						sx={{ opacity: 0.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
						children={repo.url}
					/>
				</Stack>
				<LunaTrashButton disabled={repo.url === devStoreUrl} title="Remove repository" onClick={() => removeRepository(repo.url)} />
			</Stack>
		))}
	</Stack>
));
