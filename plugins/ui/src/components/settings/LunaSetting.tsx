import React from "react";

import Box from "@mui/material/Box";
import Stack, { type StackProps } from "@mui/material/Stack";
import { LunaTitle, type LunaTitleValues } from "../LunaTitle";

export type LunaSettingProps = Omit<StackProps, "title"> & LunaTitleValues;

export const LunaSetting = React.memo((props: LunaSettingProps) => {
	const { title, desc, variant, children, sx, ...stackProps } = props;
	return (
		<Stack
			{...stackProps}
			sx={[
				{
					display: "grid",
					gridTemplateColumns: { xs: "minmax(0, 1fr)", sm: "minmax(0, 1fr) minmax(220px, 40%)" },
					columnGap: 3,
					rowGap: 1,
					alignItems: "center",
					width: "100%",
					minWidth: 0,
				},
				...(Array.isArray(sx) ? sx : sx ? [sx] : []),
			]}
		>
			<LunaTitle
				sx={{ minWidth: 0, overflowWrap: "anywhere" }}
				variant={variant ?? "h8"}
				title={title}
				desc={desc}
			/>
			<Box
				display="flex"
				sx={{
					width: "100%",
					minWidth: 0,
					alignItems: "center",
					justifyContent: { xs: "flex-start", sm: "flex-end" },
				}}
			>
				{children}
			</Box>
		</Stack>
	);
});
