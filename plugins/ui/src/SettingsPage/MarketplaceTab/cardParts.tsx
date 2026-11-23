import React from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";

import DownloadIcon from "@mui/icons-material/Download";

import { LunaAuthorDisplay } from "../../components";
import { gridCardSx, pillButton, primaryButton, surface, tag } from "../styles";
import { devStoreUrl, type Repository } from "./catalog";

/** Shared layout of plugin and theme cards in the Marketplace and the Installed tab */

// Luna's UI is English, so "5.6K" and not the system locale's compact form
const compactNumber = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 });

/** Only https images are shown (`preview` in a plugin's package.json or a theme listing), plus the local dev store's own */
export const previewImage = (value: unknown) => {
	if (typeof value !== "string") return undefined;
	const url = URL.parse(value);
	if (url?.protocol === "https:" || url?.origin === devStoreUrl) return value;
};

const Preview = ({ src }: { src: string }) => {
	const [failed, setFailed] = React.useState(false);
	if (failed) return null;
	return (
		<Box
			component="img"
			src={src}
			alt=""
			loading="lazy"
			referrerPolicy="no-referrer"
			onError={() => setFailed(true)}
			sx={{ width: "100%", aspectRatio: "16 / 9", objectFit: "cover", borderRadius: 2, display: "block", backgroundColor: surface }}
		/>
	);
};

const DownloadsBadge = ({ downloads }: { downloads: number }) => (
	<Tooltip title={`${downloads.toLocaleString()} downloads of the current build (GitHub release)`}>
		<Stack
			direction="row"
			role="img"
			aria-label={`${downloads.toLocaleString()} downloads`}
			sx={{ alignItems: "center", gap: 0.25, flexShrink: 0, color: "text.secondary" }}
		>
			<DownloadIcon sx={{ fontSize: 16 }} />
			<Typography variant="caption" sx={{ fontWeight: 600 }} children={compactNumber.format(downloads)} />
		</Stack>
	</Tooltip>
);

/** Repository chip: picking it shows only that repository's items, picking it again shows all. White while it is the filter. */
export const RepositoryChip = ({ repository, active, onPick }: { repository?: Repository; active?: boolean; onPick: (url: string) => void }) => {
	if (repository === undefined) return <Chip size="small" variant="outlined" sx={{ ...tag, color: "text.secondary" }} label="from url" />;
	return (
		<Chip
			size="small"
			variant="outlined"
			aria-pressed={!!active}
			sx={{
				...tag,
				maxWidth: "100%",
				color: active ? "#000" : "text.secondary",
				backgroundColor: active ? "#fff" : undefined,
				borderColor: active ? "#fff" : tag.borderColor,
				"&.MuiChip-clickable:hover": { backgroundColor: active ? "rgba(255, 255, 255, 0.82)" : "rgba(255, 255, 255, 0.08)" },
			}}
			title={active ? "Show all repositories again" : `Show only ${repository.name ?? repository.url}`}
			label={repository.name ?? "Unknown repository"}
			onClick={() => onPick(repository.url)}
		/>
	);
};

type CardShellProps = {
	id: string;
	/** Attribute that carries id, for tests and themes */
	idAttribute?: string;
	name: React.ReactNode;
	/** Tooltip on the name */
	title?: string;
	version?: string;
	preview?: string;
	/** Right end of the name line, e.g. downloads */
	badge?: React.ReactNode;
	author?: React.ComponentProps<typeof LunaAuthorDisplay>["author"];
	description?: React.ReactNode;
	tags?: React.ReactNode;
	/** Full-width block above the actions: update, load error */
	notice?: React.ReactNode;
	actions: React.ReactNode;
	/** Border color, e.g. for an update or an error */
	highlight?: string;
};

/** Card frame shared by every plugin and theme card: preview, name line, author, clamped description, tags, notice, actions */
export const CardShell = ({
	id,
	idAttribute = "data-luna-marketplace-item",
	name,
	title,
	version,
	preview,
	badge,
	author,
	description,
	tags,
	notice,
	actions,
	highlight,
}: CardShellProps) => (
	<Stack spacing={1.25} {...{ [idAttribute]: id }} sx={{ ...gridCardSx, ...(highlight !== undefined && { borderColor: highlight }) }}>
		{preview && <Preview key={preview} src={preview} />}
		<Stack direction="row" spacing={1} sx={{ alignItems: "center", minWidth: 0, minHeight: 28 }}>
			<Typography variant="subtitle1" noWrap title={title} sx={{ fontWeight: 700, lineHeight: 1.3, minWidth: 0, flexShrink: 1 }} children={name} />
			{version && <Typography variant="caption" noWrap sx={{ color: "text.secondary", flexShrink: 0, maxWidth: "40%" }} children={version} />}
			<Box sx={{ flexGrow: 1 }} />
			{badge}
		</Stack>
		{author && <Box sx={{ minWidth: 0, overflowWrap: "anywhere" }} children={<LunaAuthorDisplay author={author} />} />}
		{/* The clamp sits in a growing box: growing the clamped text itself shows a cut 4th line */}
		<Box sx={{ flexGrow: 1 }}>
			<Typography
				variant="body2"
				sx={{
					color: "text.secondary",
					overflowWrap: "anywhere",
					display: "-webkit-box",
					WebkitLineClamp: 3,
					WebkitBoxOrient: "vertical",
					overflow: "hidden",
				}}
				children={description}
			/>
		</Box>
		{tags && <Stack direction="row" sx={{ flexWrap: "wrap", gap: 0.5, minWidth: 0 }} children={tags} />}
		{notice}
		<Stack direction="row" sx={{ paddingTop: 0.5, alignItems: "center", gap: 1, minHeight: 36 }} children={actions} />
	</Stack>
);

const uninstallSx = {
	...pillButton,
	color: red[300],
	"&:hover": { backgroundColor: "rgba(229, 115, 115, 0.12)" },
	"&.Mui-disabled": { color: "rgba(229, 115, 115, 0.5)" },
};

/** Marketplace card: what the repository lists, plus Install / Uninstall */
export const CatalogCard = ({
	downloads,
	installed,
	uninstallHint,
	onToggleInstall,
	...shell
}: Omit<CardShellProps, "badge" | "actions" | "notice" | "idAttribute"> & {
	downloads?: number;
	installed: boolean;
	uninstallHint?: string;
	onToggleInstall: () => Promise<unknown>;
}) => {
	// What the click started: install() marks the plugin installed before it finishes loading (and asks about native code)
	const [busy, setBusy] = React.useState<"installing" | "removing">();
	const toggleInstall = async () => {
		setBusy(installed ? "removing" : "installing");
		try {
			await onToggleInstall();
		} finally {
			setBusy(undefined);
		}
	};
	const removing = busy === undefined ? installed : busy === "removing";
	return (
		<CardShell
			{...shell}
			badge={downloads !== undefined && <DownloadsBadge downloads={downloads} />}
			actions={
				<Tooltip title={busy === undefined && installed ? (uninstallHint ?? "") : ""}>
					<span>
						<Button
							size="small"
							variant={removing ? "text" : "contained"}
							sx={removing ? uninstallSx : primaryButton}
							disabled={busy !== undefined}
							onClick={toggleInstall}
							children={busy === "installing" ? "Installing…" : busy === "removing" ? "Removing…" : installed ? "Uninstall" : "Install"}
						/>
					</span>
				</Tooltip>
			}
		/>
	);
};
