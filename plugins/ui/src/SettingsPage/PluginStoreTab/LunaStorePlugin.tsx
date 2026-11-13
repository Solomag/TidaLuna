import { LunaPlugin } from "@luna/core";

import React, { useEffect, useState } from "react";

import { LunaPluginHeader } from "../PluginsTab/LunaPluginHeader";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

export const LunaStorePlugin = React.memo(({ url }: { url: string }) => {
	const [plugin, setPlugin] = useState<LunaPlugin | undefined>(undefined);
	const [loadError, setLoadError] = useState<string | undefined>(undefined);
	const [installed, setInstalled] = useState(false);
	const [busy, setBusy] = useState(false);

	useEffect(() => {
		LunaPlugin.fromStorage({ url })
			.then((next) => {
				setPlugin(next);
				setInstalled(next.installed);
			})
			.catch(setLoadError);
	}, [url]);

	if (!plugin) return null;

	const version = url.startsWith("http://127.0.0.1") ? `${plugin.package?.version ?? ""} [DEV]` : plugin.package?.version;

	const toggleInstalled = async () => {
		if (busy) return;
		setBusy(true);
		const next = !installed;
		setInstalled(next);
		try {
			if (next) await plugin.install();
			else await plugin.uninstall();
			setInstalled(plugin.installed);
		} catch (error) {
			setInstalled(!next);
			console.error(`[Luna UI] Failed to ${next ? "install" : "uninstall"} ${plugin.name}`, error);
		} finally {
			setBusy(false);
		}
	};

	return (
		<Box
			data-solo-plugin-card="true"
			sx={{
				position: "relative",
				display: "flex",
				flexDirection: "column",
				alignItems: "stretch",
				width: "100%",
				height: "100%",
				minWidth: 0,
				boxSizing: "border-box",
				borderRadius: 2,
				backgroundColor: "rgba(0, 0, 0, 0.2)",
				padding: "14px 20px 18px",
				boxShadow: 5,
			}}
		>
			<LunaPluginHeader
				sx={{
					width: "100%",
					minWidth: 0,
					flex: "1 1 auto",
					alignContent: "start",
					"& > :nth-of-type(2)": {
						minHeight: "2.6em",
						display: "-webkit-box",
						WebkitBoxOrient: "vertical",
						WebkitLineClamp: 2,
						overflow: "hidden",
					},
				}}
				name={plugin.name}
				version={version}
				loadError={loadError}
				author={plugin.package?.author}
				desc={plugin.package?.description}
			/>
			<Button
				className="solo-plugin-store-real-action"
				variant="contained"
				size="small"
				disabled={busy}
				onClick={toggleInstalled}
				sx={{ alignSelf: "flex-end", minWidth: 84, height: 32, marginTop: "auto", flex: "0 0 auto" }}
			>
				{busy ? "Working…" : installed ? "Uninstall" : "Install"}
			</Button>
		</Box>
	);
});
