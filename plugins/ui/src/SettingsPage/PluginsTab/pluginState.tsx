import React from "react";
import type { ErrorInfo, ReactNode } from "react";

import { LunaPlugin, unloadSet, type PluginPackage } from "@luna/core";
import { store as obyStore } from "oby";

import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { grey, red } from "@mui/material/colors";

export class PluginSettingsErrorBoundary extends React.Component<{ name: string; children: ReactNode }, { error?: string }> {
	state: { error?: string } = {};
	static getDerivedStateFromError(error: Error) {
		return { error: error.message || String(error) };
	}
	componentDidCatch(error: Error, info: ErrorInfo) {
		console.error(`[Luna] Plugin settings crashed for ${this.props.name}:`, error, info.componentStack);
	}
	render() {
		if (this.state.error) {
			return (
				<Stack spacing={1} sx={{ padding: 1 }}>
					<Typography variant="body2" sx={{ color: red[300] }}>
						Settings crashed: {this.state.error}
					</Typography>
					<Button
						size="small"
						variant="outlined"
						sx={{ alignSelf: "flex-start", color: grey[400], borderColor: grey[700] }}
						onClick={() => this.setState({ error: undefined })}
					>
						Retry
					</Button>
				</Stack>
			);
		}
		return this.props.children;
	}
}

/** What a plugin card shows, kept in sync with the plugin */
export const usePluginState = (plugin: LunaPlugin) => {
	// A new card can mount before install() finishes enabling the plugin.
	const enabled = React.useSyncExternalStore(plugin.onSetEnabled, () => Boolean(plugin.enabled));
	const subscribeLoading = React.useCallback((notify: () => void) => plugin.loading.onValue(notify), [plugin]);
	const loading = React.useSyncExternalStore(subscribeLoading, () => plugin.loading._);
	const [loadError, setLoadError] = React.useState(plugin.loadError._);
	const [installed, setInstalled] = React.useState(plugin.installed);
	const [pkg, setPackage] = React.useState<PluginPackage>(obyStore.unwrap(plugin.store.package));

	React.useEffect(() => {
		const unloads = new Set([
			plugin.loadError.onValue((next) => setLoadError(next)),
			obyStore.on(
				() => plugin.store.package,
				() => setPackage(obyStore.unwrap(plugin.store.package)),
			),
			obyStore.on(
				() => plugin.installed,
				() => setInstalled(obyStore.unwrap(plugin.store.installed)),
			),
		]);
		return () => {
			unloadSet(unloads);
		};
	}, [plugin]);

	const isDev = plugin.store.url.startsWith("http://127.0.0.1");
	return {
		enabled,
		loading,
		loadError,
		installed,
		pkg,
		isDev,
		version: isDev ? `${pkg.version ?? ""} [DEV]` : pkg.version,
		link: pkg.homepage ?? pkg.repository?.url,
	};
};
