import React from "react";

import { LunaPlugin, Tracer } from "@luna/core";

import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import CachedIcon from "@mui/icons-material/Cached";

import { softButton } from "../styles";

const { trace } = Tracer("[@luna/ui]", null);

export const ReloadAllPlugins = React.memo(() => {
	const [reloading, setReloading] = React.useState(false);

	const onClick = React.useCallback(async () => {
		setReloading(true);
		try {
			const failed = await LunaPlugin.reloadAll();
			if (failed.length === 0) trace.msg.log("Reloaded all plugins");
			else trace.msg.warn(`Reloaded plugins, ${failed.length} failed: ${failed.map((plugin) => plugin.name).join(", ")}`);
		} finally {
			setReloading(false);
		}
	}, []);

	return (
		<Tooltip title="Reload every enabled plugin">
			<span style={{ flexShrink: 0 }}>
				<Button
					size="small"
					sx={softButton()}
					disabled={reloading}
					onClick={onClick}
					startIcon={
						<CachedIcon
							sx={{
								animation: reloading ? "spin 0.5s linear infinite" : "none",
								"@keyframes spin": { "0%": { transform: "rotate(0deg)" }, "100%": { transform: "rotate(360deg)" } },
							}}
						/>
					}
				>
					Reload all
				</Button>
			</span>
		</Tooltip>
	);
});
