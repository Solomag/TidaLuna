import type { LunaAuthor } from "@luna/core";

import Box, { type BoxProps } from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import React, { type PropsWithChildren, type ReactNode } from "react";

import { LunaAuthorDisplay, LunaLink } from "../../components";

export interface LunaPluginComponentProps extends PropsWithChildren {
	name: string;
	/** Tooltip on the name, e.g. the full package name */
	title?: string;
	version?: string;
	link?: string;
	loadError?: string;
	author?: LunaAuthor | string;
	desc?: ReactNode;
	sx?: BoxProps["sx"];
}
export const LunaPluginHeader = React.memo(({ name, title, version, loadError, author, desc, children, sx, link }: LunaPluginComponentProps) => (
	<Box sx={sx}>
		<Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
			<Typography variant="subtitle1" title={title} sx={{ fontWeight: 700, fontSize: "1.05rem", lineHeight: 1.3 }}>
				<LunaLink href={link}>{name}</LunaLink>
				{version && <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 400, marginLeft: 0.75 }} children={version} />}
			</Typography>
			{children}
			{loadError && (
				<Typography
					variant="caption"
					sx={{
						color: "white",
						fontWeight: 500,
						backgroundColor: "rgba(256, 0, 0, 0.5)",
						padding: 1,
						borderRadius: 1,
						paddingTop: 1.5,
					}}
					children={loadError}
				/>
			)}
			<Box sx={{ flexGrow: 1 }} /> {/* This pushes the author section to the right */}
			{author && <LunaAuthorDisplay author={author} />}
		</Stack>
		{desc && <Typography variant="body2" sx={{ color: "text.secondary", marginTop: 0.25 }} gutterBottom children={desc} />}
	</Box>
));
