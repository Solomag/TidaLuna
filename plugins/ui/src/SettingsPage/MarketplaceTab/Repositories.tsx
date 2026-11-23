import React from "react";

import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { LunaTrashButton } from "../../components";
import { InstallFromUrl } from "../PluginStoreTab/InstallFromUrl";
import { devStoreUrl, removeRepository, type Repository } from "./catalog";
import { hairline, surface, tag } from "./styles";

/** Former "stores": a repository is a store.json listing plugins */
export const Repositories = React.memo(({ repositories }: { repositories: Repository[] }) => (
	<Stack spacing={1.5} sx={{ padding: 2, borderRadius: 3, border: `1px solid ${hairline}`, backgroundColor: surface }}>
		<Typography variant="body2" sx={{ color: "text.secondary" }} children="Add a repository (store.json url) or install a single plugin by url:" />
		<Box sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2, backgroundColor: "rgba(255, 255, 255, 0.08)" } }} children={<InstallFromUrl />} />
		<Stack sx={{ maxHeight: 360, overflowY: "auto", marginX: -1 }}>
			{repositories.map((repo) => (
				<Stack
					key={repo.url}
					direction="row"
					spacing={1}
					sx={{ alignItems: "center", paddingX: 1, paddingY: 0.75, borderRadius: 2, "&:hover": { backgroundColor: surface } }}
				>
					<Stack sx={{ flexGrow: 1, minWidth: 0 }}>
						<Stack direction="row" spacing={1} sx={{ alignItems: "center", minWidth: 0 }}>
							<Typography variant="body2" noWrap sx={{ fontWeight: 600, minWidth: 40 }} children={repo.name ?? "Unknown repository"} />
							{repo.url === devStoreUrl && <Chip size="small" color="info" sx={tag} label="dev" />}
							<Typography
								variant="caption"
								noWrap
								title={repo.error}
								sx={{ color: repo.error ? "error.light" : "text.secondary", minWidth: 0, flexShrink: repo.error ? 1 : 0 }}
								children={repo.error ? `failed: ${repo.error}` : `${repo.plugins.length} plugin${repo.plugins.length === 1 ? "" : "s"}`}
							/>
						</Stack>
						<Typography variant="caption" noWrap sx={{ color: "text.secondary", opacity: 0.7 }} title={repo.url} children={repo.url} />
					</Stack>
					<LunaTrashButton
						disabled={repo.url === devStoreUrl}
						title="Remove repository (plugins installed from it stay installed)"
						onClick={() => removeRepository(repo.url)}
					/>
				</Stack>
			))}
		</Stack>
	</Stack>
));
