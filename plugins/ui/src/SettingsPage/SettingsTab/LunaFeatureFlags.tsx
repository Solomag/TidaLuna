import { redux, Tidal } from "@luna/lib";
import React from "react";
import { LunaSettings, LunaSwitch, SpinningButton } from "../../components";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import SettingsIcon from "@mui/icons-material/Settings";
import { grey } from "@mui/material/colors";

function flagTitle(name: string) {
	return name[0].toUpperCase() + name.slice(1).replaceAll("-", " ");
}

export const LunaFeatureFlags = React.memo(() => {
	const [featureFlags, setFeatureFlags] = React.useState(Tidal.featureFlags);
	const [hide, setHidden] = React.useState(false);

	const setFlag = React.useCallback((flag: redux.FeatureFlag) => {
		redux.actions["featureFlags/TOGGLE_USER_OVERRIDE"]({ ...flag, value: !flag.value });
		setFeatureFlags(Tidal.featureFlags);
	}, []);

	return (
		<LunaSettings
			title="Feature flags"
			desc="Feature flags & experiments currently in the Tidal desktop app. These are internal from Tidal and not Luna features"
			titleChildren={
				<SpinningButton title={hide ? "Show flags" : "Hide flags"} onClick={() => setHidden(!hide)} icon={SettingsIcon} sxColor={grey.A400} />
			}
			display={hide ? "none" : "flex"}
		>
			{!hide && (
				<Box
					data-lunatic-feature-flags-grid="true"
					sx={{
						display: "grid",
						gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
						gap: "12px 16px",
						width: "100%",
						minWidth: 0,
						"@media (max-width: 1180px)": { gridTemplateColumns: "repeat(2, minmax(0, 1fr))" },
						"@media (max-width: 700px)": { gridTemplateColumns: "minmax(0, 1fr)" },
					}}
				>
					{Object.values(featureFlags)
						.sort((a, b) => a.name.localeCompare(b.name))
						.map((flag) => (
							<Box
								key={flag.name}
								data-lunatic-feature-flag="true"
								sx={{
									display: "flex",
									alignItems: "center",
									justifyContent: "space-between",
									gap: "12px",
									width: "100%",
									minWidth: 0,
									minHeight: "58px",
									boxSizing: "border-box",
									padding: "10px 12px",
									overflow: "hidden",
									backgroundColor: "var(--lunatic-luna-inner, rgba(0, 0, 0, .20))",
									border: "1px solid var(--lunatic-luna-edge, rgba(255,255,255,.075))",
								}}
							>
								<Typography
									variant="h8"
									title={flagTitle(flag.name)}
									sx={{
										flex: "1 1 auto",
										minWidth: 0,
										lineHeight: 1.25,
										overflowWrap: "anywhere",
									}}
								>
									{flagTitle(flag.name)}
								</Typography>
								<LunaSwitch
									disabled={flag.type !== "BOOLEAN"}
									onClick={setFlag.bind(null, flag)}
									checked={flag.value}
									sx={{ flex: "0 0 auto", position: "relative", margin: 0 }}
								/>
							</Box>
						))}
				</Box>
			)}
		</LunaSettings>
	);
});
