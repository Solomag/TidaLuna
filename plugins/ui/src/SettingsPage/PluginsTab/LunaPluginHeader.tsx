import type { LunaAuthor } from "@luna/core";

import Box, { type BoxProps } from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import React, { type PropsWithChildren, type ReactNode } from "react";

import { LunaAuthorDisplay, LunaLink } from "../../components";

export interface LunaPluginComponentProps extends PropsWithChildren {
	name: string;
	version?: string;
	link?: string;
	loadError?: string;
	author?: LunaAuthor | string;
	desc?: ReactNode;
	sx?: BoxProps["sx"];
}

export const LunaPluginHeader = React.memo(({ name, version, loadError, author, desc, children, sx, link }: LunaPluginComponentProps) => (
	<Box
		sx={[
		{
			display: "grid",
			gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "minmax(0, 1fr) auto" },
			columnGap: 2,
			rowGap: 1,
			alignItems: "start",
			minWidth: 0,
		},
		...(Array.isArray(sx) ? sx : sx ? [sx] : []),
	]}
	>
		<Stack spacing={0.5} sx={{ minWidth: 0 }}>
			<Stack direction="row" alignItems="baseline" spacing={0.75} useFlexGap flexWrap="wrap" sx={{ minWidth: 0 }}>
				<Typography variant="h6" sx={{ minWidth: 0, overflowWrap: "anywhere" }}>
					<LunaLink href={link}>{name}</LunaLink>
				</Typography>
				{version && (
					<Typography variant="caption" sx={{ opacity: 0.7, flexShrink: 0 }}>
						{version}
					</Typography>
				)}
			</Stack>

			{desc && (
				<Typography variant="subtitle2" sx={{ overflowWrap: "anywhere" }}>
					{desc}
				</Typography>
			)}

			{author && <LunaAuthorDisplay author={author} sx={{ alignSelf: "flex-start" }} />}

			{loadError && (
				<Typography
					variant="caption"
					sx={{
						alignSelf: "flex-start",
						color: "white",
						fontWeight: 500,
						backgroundColor: "rgba(255, 0, 0, 0.5)",
						paddingX: 1,
						paddingY: 0.5,
						borderRadius: 1,
					}}
				>
					{loadError}
				</Typography>
			)}
		</Stack>

		<Box
			sx={{
				display: "flex",
				alignItems: "center",
				justifyContent: { xs: "flex-start", md: "flex-end" },
				flexWrap: "wrap",
				gap: 0.5,
				minWidth: 0,
			}}
		>
			{children}
		</Box>
	</Box>
));
