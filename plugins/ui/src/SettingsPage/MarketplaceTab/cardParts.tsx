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
import { hairline, pillButton, primaryButton, surface, surfaceHover, tag } from "../styles";
import type { Repository } from "./catalog";

/** Shared layout of plugin and theme cards in the Marketplace */

// Luna's UI is English, so "5.6K" and not the system locale's compact form
const compactNumber = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 });

/** Only https images are shown (`preview` in a plugin's package.json or a theme listing) */
export const httpsImage = (value: unknown) => (typeof value === "string" && URL.parse(value)?.protocol === "https:" ? value : undefined);

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

/** Repository chip: picking it shows only that repository's items */
export const RepositoryChip = ({ repository, onPick }: { repository?: Repository; onPick: (url: string) => void }) =>
	repository ? (
		<Chip
			size="small"
			variant="outlined"
			sx={{ ...tag, color: "text.secondary", maxWidth: "100%" }}
			title={`Show only ${repository.name ?? repository.url}`}
			label={repository.name ?? "Unknown repository"}
			onClick={() => onPick(repository.url)}
		/>
	) : (
		<Chip size="small" variant="outlined" sx={{ ...tag, color: "text.secondary" }} label="from url" />
	);

const uninstallSx = {
	...pillButton,
	color: red[300],
	"&:hover": { backgroundColor: "rgba(229, 115, 115, 0.12)" },
	"&.Mui-disabled": { color: "rgba(229, 115, 115, 0.5)" },
};

export const CatalogCard = ({
	id,
	name,
	title,
	version,
	preview,
	downloads,
	author,
	description,
	tags,
	installed,
	uninstallHint,
	onToggleInstall,
}: {
	/** data-luna-marketplace-item, for tests and themes */
	id: string;
	name: string;
	/** Tooltip on the name */
	title?: string;
	version?: string;
	preview?: string;
	downloads?: number;
	author?: React.ComponentProps<typeof LunaAuthorDisplay>["author"];
	description?: React.ReactNode;
	tags: React.ReactNode;
	installed: boolean;
	uninstallHint?: string;
	onToggleInstall: () => Promise<unknown>;
}) => {
	const [busy, setBusy] = React.useState(false);
	const toggleInstall = async () => {
		setBusy(true);
		try {
			await onToggleInstall();
		} finally {
			setBusy(false);
		}
	};
	return (
		<Stack
			spacing={1.25}
			data-luna-marketplace-item={id}
			sx={{
				padding: 2,
				borderRadius: 3,
				minWidth: 0,
				border: `1px solid ${hairline}`,
				backgroundColor: surface,
				transition: "background-color 120ms, border-color 120ms",
				"&:hover": { backgroundColor: surfaceHover, borderColor: "rgba(255, 255, 255, 0.18)" },
			}}
		>
			{preview && <Preview key={preview} src={preview} />}
			<Stack direction="row" spacing={1} sx={{ alignItems: "center", minWidth: 0, minHeight: 28 }}>
				<Typography variant="subtitle1" noWrap title={title} sx={{ fontWeight: 700, lineHeight: 1.3, minWidth: 0, flexShrink: 1 }} children={name} />
				{version && <Typography variant="caption" sx={{ color: "text.secondary", flexShrink: 0 }} children={version} />}
				<Box sx={{ flexGrow: 1 }} />
				{downloads !== undefined && <DownloadsBadge downloads={downloads} />}
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
			<Stack direction="row" sx={{ flexWrap: "wrap", gap: 0.5, minWidth: 0 }} children={tags} />
			<Stack direction="row" sx={{ paddingTop: 0.5, flexWrap: "wrap", gap: 1 }}>
				<Tooltip title={installed ? (uninstallHint ?? "") : ""}>
					<span>
						<Button
							size="small"
							variant={installed ? "text" : "contained"}
							sx={installed ? uninstallSx : primaryButton}
							disabled={busy}
							onClick={toggleInstall}
							children={busy ? (installed ? "Removing…" : "Installing…") : installed ? "Uninstall" : "Install"}
						/>
					</span>
				</Tooltip>
			</Stack>
		</Stack>
	);
};
