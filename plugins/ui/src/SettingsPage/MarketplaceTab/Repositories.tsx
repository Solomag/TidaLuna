import React from "react";

import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { LunaTrashButton } from "../../components";
import { devStoreUrl, removeRepository, type Repository } from "./catalog";
import { InstallFromUrl } from "./InstallFromUrl";
import { hairline, surface, surfaceHover, tag } from "../styles";

/** Repository filter value for plugins installed from a plain url */
export const fromUrl = "";
/** Repository filter value: no filter */
export const allRepositories = "*";

const rowSx = (active: boolean) => ({
	alignItems: "center",
	paddingRight: 1,
	borderRadius: 2,
	backgroundColor: active ? surfaceHover : undefined,
	"&:hover": { backgroundColor: surfaceHover },
});
const rowButtonSx = {
	flexGrow: 1,
	minWidth: 0,
	justifyContent: "flex-start",
	textAlign: "left",
	paddingX: 1,
	paddingY: 0.75,
	borderRadius: 2,
} as const;

/**
 * Former "stores": a repository is a store.json listing plugins (and themes).
 * The one repository control of the Marketplace: picking one shows only its items in the current view, picking it again shows all.
 */
export const Repositories = React.memo(
	({
		repositories,
		view,
		selected,
		showFromUrl,
		onPick,
		onShowAll,
	}: {
		repositories: Repository[];
		view: "plugins" | "themes";
		selected: string;
		/** Some items were installed from a plain url, offer them as a filter too */
		showFromUrl: boolean;
		onPick: (url: string) => void;
		onShowAll: () => void;
	}) => (
		<Stack spacing={1.5} sx={{ padding: 2, borderRadius: 3, border: `1px solid ${hairline}`, backgroundColor: surface }}>
			<Typography
				variant="body2"
				sx={{ color: "text.secondary" }}
				children="Add a repository (store.json url), or install a single plugin or theme (.css) by url:"
			/>
			<Box sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2, backgroundColor: "rgba(255, 255, 255, 0.08)" } }} children={<InstallFromUrl />} />
			<Typography
				variant="caption"
				sx={{ color: "text.secondary" }}
				children={`Pick a repository to show only its ${view}, pick it again to show all.`}
			/>
			<Stack sx={{ maxHeight: 360, overflowY: "auto", marginX: -1 }}>
				{[
					{ key: "all", label: "All repositories", active: selected === allRepositories, pick: onShowAll },
					...(showFromUrl ? [{ key: "url", label: "Installed from url", active: selected === fromUrl, pick: () => onPick(fromUrl) }] : []),
				].map((row) => (
					<Stack key={row.key} direction="row" sx={rowSx(row.active)}>
						<ButtonBase aria-pressed={row.active} onClick={row.pick} sx={rowButtonSx}>
							<Typography variant="body2" noWrap sx={{ fontWeight: row.active ? 800 : 600 }} children={row.label} />
						</ButtonBase>
					</Stack>
				))}
				{repositories.map((repo) => {
					const active = repo.url === selected;
					const count = view === "plugins" ? repo.plugins.length : repo.themes.length;
					const noun = view === "plugins" ? "plugin" : "theme";
					return (
						<Stack key={repo.url} direction="row" spacing={1} sx={rowSx(active)}>
							<ButtonBase aria-pressed={active} disabled={!!repo.error || count === 0} onClick={() => onPick(repo.url)} sx={rowButtonSx}>
								<Stack sx={{ minWidth: 0 }}>
									<Stack direction="row" spacing={1} sx={{ alignItems: "center", minWidth: 0 }}>
										<Typography
											variant="body2"
											noWrap
											sx={{ fontWeight: active ? 800 : 600, minWidth: 40 }}
											children={repo.name ?? "Unknown repository"}
										/>
										{repo.url === devStoreUrl && <Chip size="small" color="info" sx={tag} label="dev" />}
										<Typography
											variant="caption"
											noWrap
											title={repo.error}
											sx={{ color: repo.error ? "error.light" : "text.secondary", minWidth: 0, flexShrink: repo.error ? 1 : 0 }}
											children={repo.error ? `failed: ${repo.error}` : `${count} ${noun}${count === 1 ? "" : "s"}`}
										/>
									</Stack>
									<Typography variant="caption" noWrap sx={{ color: "text.secondary", opacity: 0.7 }} title={repo.url} children={repo.url} />
								</Stack>
							</ButtonBase>
							<LunaTrashButton
								disabled={repo.url === devStoreUrl}
								title="Remove repository (plugins installed from it stay installed)"
								onClick={() => removeRepository(repo.url)}
							/>
						</Stack>
					);
				})}
			</Stack>
		</Stack>
	),
);
