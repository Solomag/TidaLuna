import { panelStyles } from "../../wave";
import { createLunaStack } from "../createLunaStack";

/** TIDAL's Settings panel look, for plugins styling their own containers like LunaSettings */
export const settingsSx = panelStyles;

// Rows in a panel like TIDAL's Settings page, as base styles so theme styleOverrides can change them
export const LunaSettings = createLunaStack("LunaSettings", "h7", () => panelStyles, 0, {
	// Sections one after another, spaced like TIDAL's
	"& + .LunaSettings-root": { marginTop: 32 },
});
