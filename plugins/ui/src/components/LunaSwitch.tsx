import React from "react";

import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Switch from "@mui/material/Switch";

import type { SwitchProps } from "@mui/material/Switch";
import Tooltip from "@mui/material/Tooltip";

import { wave } from "../wave";

// TIDAL's thumb: a black dot on the light (on) or dark grey (off) track, with a spinner while loading
const LoadingIcon = React.memo(({ loading }: { loading?: boolean }) => (
	<Box
		style={{
			borderRadius: "50%",
			width: 18,
			height: 18,
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			backgroundColor: wave.baseFill,
		}}
	>
		{loading && <CircularProgress size={12} thickness={4} style={{ color: wave.contrastDark }} />}
	</Box>
));

export interface LunaSwitchProps extends Omit<SwitchProps, "title"> {
	loading?: boolean;
	tooltip?: string;
}
export const LunaSwitch = React.memo((props: LunaSwitchProps) => {
	const { tooltip, loading, ...switchProps } = props;
	return (
		<Tooltip
			sx={{
				marginRight: "auto",
			}}
			title={tooltip}
		>
			<Switch
				disabled={loading}
				icon={<LoadingIcon loading={loading} />}
				checkedIcon={<LoadingIcon loading={loading} />}
				{...switchProps}
				sx={{ marginLeft: "auto", ...switchProps.sx }}
			/>
		</Tooltip>
	);
});
