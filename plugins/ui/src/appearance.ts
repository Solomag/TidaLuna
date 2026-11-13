import React from "react";
import { ReactiveStore } from "@luna/core";

export type LunaUiAppearance = {
	pageBackground: string;
	pageBackgroundImage: string;
	backgroundFit: "cover" | "contain" | "auto";
	backgroundPositionX: number;
	backgroundPositionY: number;
	backgroundZoom: number;
	shellBackground: string;
	cardBackground: string;
	innerBackground: string;
	controlBackground: string;
	borderColor: string;
	strongBorderColor: string;
	textColor: string;
	mutedTextColor: string;
	borderRadius: number;
	surfaceOpacity: number;
	hideAuthorAvatars: boolean;
	singleIconColor: boolean;
	iconColor: string;
	reloadIconColor: string;
	liveReloadIconColor: string;
	settingsIconColor: string;
	uninstallIconColor: string;
};

export const defaultLunaUiAppearance: LunaUiAppearance = {
	pageBackground: "#09090b",
	pageBackgroundImage: "",
	backgroundFit: "cover",
	backgroundPositionX: 50,
	backgroundPositionY: 50,
	backgroundZoom: 100,
	shellBackground: "#111116",
	cardBackground: "#1c1c1f",
	innerBackground: "#141419",
	controlBackground: "#202026",
	borderColor: "rgba(255,255,255,.10)",
	strongBorderColor: "rgba(255,255,255,.18)",
	textColor: "rgba(255,255,255,.94)",
	mutedTextColor: "rgba(255,255,255,.64)",
	borderRadius: 10,
	surfaceOpacity: 100,
	hideAuthorAvatars: false,
	singleIconColor: true,
	iconColor: "#d8d8de",
	reloadIconColor: "#ff7a00",
	liveReloadIconColor: "#e5484d",
	settingsIconColor: "#d8d8de",
	uninstallIconColor: "#e5484d",
};

export const lunaUiAppearance = await ReactiveStore.getPluginStorage<LunaUiAppearance>("appearance", defaultLunaUiAppearance);

const previousPrototypeDefaults = {
	shellBackground: "rgba(8, 10, 15, .76)",
	cardBackground: "rgba(10, 12, 17, .86)",
	innerBackground: "rgba(7, 9, 13, .72)",
	controlBackground: "rgba(12, 14, 20, .92)",
};
const wasPrototypeDefault =
	lunaUiAppearance.shellBackground === previousPrototypeDefaults.shellBackground &&
	lunaUiAppearance.cardBackground === previousPrototypeDefaults.cardBackground &&
	lunaUiAppearance.innerBackground === previousPrototypeDefaults.innerBackground &&
	lunaUiAppearance.controlBackground === previousPrototypeDefaults.controlBackground;

for (const [key, value] of Object.entries(defaultLunaUiAppearance) as [keyof LunaUiAppearance, LunaUiAppearance[keyof LunaUiAppearance]][]) {
	if (lunaUiAppearance[key] === undefined) (lunaUiAppearance as any)[key] = value;
}
if (wasPrototypeDefault) {
	lunaUiAppearance.shellBackground = defaultLunaUiAppearance.shellBackground;
	lunaUiAppearance.cardBackground = defaultLunaUiAppearance.cardBackground;
	lunaUiAppearance.innerBackground = defaultLunaUiAppearance.innerBackground;
	lunaUiAppearance.controlBackground = defaultLunaUiAppearance.controlBackground;
	lunaUiAppearance.borderColor = defaultLunaUiAppearance.borderColor;
	lunaUiAppearance.strongBorderColor = defaultLunaUiAppearance.strongBorderColor;
}

const listeners = new Set<() => void>();
export function onLunaUiAppearanceChange(listener: () => void) {
	listeners.add(listener);
	return () => listeners.delete(listener);
}
export function setLunaUiAppearance<K extends keyof LunaUiAppearance>(key: K, value: LunaUiAppearance[K]) {
	lunaUiAppearance[key] = value;
	listeners.forEach((listener) => listener());
}
export function resetLunaUiAppearance() {
	Object.assign(lunaUiAppearance, defaultLunaUiAppearance);
	listeners.forEach((listener) => listener());
}
export function useLunaUiAppearance() {
	const [, redraw] = React.useReducer((value: number) => value + 1, 0);
	React.useEffect(() => onLunaUiAppearanceChange(redraw), []);
	return lunaUiAppearance;
}
export function actionIconColor(kind: "reload" | "liveReload" | "settings" | "uninstall") {
	if (lunaUiAppearance.singleIconColor) return lunaUiAppearance.iconColor;
	switch (kind) {
		case "reload": return lunaUiAppearance.reloadIconColor;
		case "liveReload": return lunaUiAppearance.liveReloadIconColor;
		case "settings": return lunaUiAppearance.settingsIconColor;
		case "uninstall": return lunaUiAppearance.uninstallIconColor;
	}
}
