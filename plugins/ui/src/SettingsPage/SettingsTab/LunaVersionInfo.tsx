import React, { useState } from "react";
import { LunaSettings } from "../../components";
import { LunaClientUpdate, version } from "./LunaClientUpdate";

export const LunaVersionInfo = React.memo(() => {
	const [_version, setVersion] = useState<string | undefined>(version);

	return (
		<LunaSettings>
			<div style={{ display: "flex", alignItems: "center", gap: 16 }}>
				<img src="https://desktop.tidal.com/assets/appIcon-C2Av_5S7.png" alt="" style={{ width: 56, height: 56, borderRadius: 14 }} />
				<div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
					<div style={{ fontSize: 20, fontWeight: 700 }}>Thanks for using TIDALuna!</div>
					<div style={{ fontSize: 14, opacity: 0.7 }}>
						Version <span style={{ color: "#31d8ff", fontWeight: 600, opacity: 1 }}>{version || "Unknown"}</span>
					</div>
				</div>
			</div>
			<LunaClientUpdate />
		</LunaSettings>
	);
});
