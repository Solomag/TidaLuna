import type { LunaUnloads } from "@luna/core";
import { Signal } from "@inrixia/helpers";
import { createTheme, ThemeProvider, type Theme, type ThemeOptions } from "@mui/material/styles";
import React from "react";

import type { LunaSettingProps } from "./components/settings/LunaSetting";
import type { LunaStackProps } from "./components/LunaStack";
import type { LunaTitleProps } from "./components/LunaTitle";
import { rowDescStyles, rowTitleStyles, wave } from "./wave";

declare module "@mui/material/styles" {
	interface TypographyVariants {
		h7: React.CSSProperties;
		h8: React.CSSProperties;
		h9: React.CSSProperties;
	}

	// allow configuration using `createTheme`
	interface TypographyVariantsOptions {
		h7?: React.CSSProperties;
		h8?: React.CSSProperties;
		h9?: React.CSSProperties;
	}
}

// Luna components that can be styled via theme.components.<Name>.styleOverrides/defaultProps
declare module "@mui/material/styles" {
	interface ComponentNameToClassKey {
		LunaTitle: "root" | "title" | "desc";
		LunaStack: "root" | "spacer" | "content";
		LunaSettings: "root" | "spacer" | "content";
		LunaSetting: "root" | "control";
	}
	interface ComponentsPropsList {
		LunaTitle: LunaTitleProps;
		LunaStack: LunaStackProps;
		LunaSettings: LunaStackProps;
		LunaSetting: LunaSettingProps;
	}
}

// Update the Typography's variant prop options
declare module "@mui/material/Typography" {
	interface TypographyPropsVariantOverrides {
		h7: true;
		h8: true;
		h9: true;
	}
}

// MUI needs real colours here to derive hovers and contrasts, so these are TIDAL's values; component styles use the wave variables
export const lunaMuiTheme = createTheme({
	palette: {
		// TIDAL is dark: light mode drew disabled buttons, field outlines and dividers in black on the dark page
		mode: "dark",
		primary: {
			main: "#fff",
		},
		secondary: {
			main: "#31d8ff",
		},
		text: {
			primary: "#fff",
			secondary: "#afafb6",
		},
		background: {
			default: "#000",
			paper: "#18181b",
		},
		divider: "#242429",
	},
	typography: {
		// TIDAL's own font (Square Sans) from the page
		fontFamily: "inherit",
		// Section headings, like TIDAL's Settings sections
		h7: { fontFamily: "inherit", fontSize: 16, fontWeight: 600, lineHeight: "24px" },
		// Setting titles
		h8: { fontFamily: "inherit", ...rowTitleStyles },
		h9: { fontFamily: "inherit", ...rowTitleStyles },
		subtitle2: { ...rowDescStyles, fontFamily: "inherit" },
	},
	components: {
		MuiTabs: {
			styleOverrides: {
				indicator: ({ theme }) => ({
					display: "flex",
					justifyContent: "center",
					backgroundColor: theme.palette.primary.main,
				}),
			},
		},
		// Add overrides for MuiTab
		MuiTab: {
			styleOverrides: {
				root: ({ theme }) => ({
					minHeight: 0,
					// Sentence case and semibold, like TIDAL's tabs
					textTransform: "none",
					fontWeight: 600,
					// Target the icon specifically for color changes

					transition: theme.transitions.create("color", {
						duration: theme.transitions.duration.short,
					}),
					// Change color when selected
					"&.Mui-selected": {
						color: theme.palette.text.primary,
						"& .MuiTab-icon": {
							color: theme.palette.secondary.main,
							transition: theme.transitions.create("color", {
								duration: theme.transitions.duration.short,
							}),
							zIndex: 1, // Ensure icon is clickable if overlapping
						},
					},
					// Change color on hover when not selected
					"&:hover:not(.Mui-selected)": {
						color: theme.palette.text.primary,
					},
				}),
			},
		},
		// TIDAL's switch: 42x26 track, light when on and dark grey when off, black 18px thumb
		MuiSwitch: {
			styleOverrides: {
				root: {
					width: 42,
					height: 26,
					padding: 0,
				},
				switchBase: {
					padding: 4,
					color: wave.baseFill,
					transitionDuration: "150ms",
					"&:hover": { backgroundColor: "transparent" },
					"&.Mui-checked": {
						transform: "translateX(16px)",
						color: wave.baseFill,
						"&:hover": { backgroundColor: "transparent" },
						"& + .MuiSwitch-track": { backgroundColor: wave.contrastDark, opacity: 1 },
					},
					// Inside the track: the root clips, and must, since MUI's hidden input is three times as wide as the thumb
					"&.Mui-focusVisible + .MuiSwitch-track": { boxShadow: `inset 0 0 0 2px ${wave.contrastDarker}` },
					"&.Mui-disabled + .MuiSwitch-track": { opacity: 0.5 },
					"&.Mui-checked.Mui-disabled + .MuiSwitch-track": { opacity: 0.5 },
				},
				thumb: {
					width: 18,
					height: 18,
					boxShadow: "none",
				},
				track: {
					borderRadius: 13,
					backgroundColor: wave.baseBrightest,
					opacity: 1,
				},
			},
		},
		// Fields and selects: dark grey fill without an outline, like TIDAL's selects
		MuiOutlinedInput: {
			styleOverrides: {
				root: {
					borderRadius: 8,
					backgroundColor: wave.baseBright,
					// A faint frame, so fields stay visible on the rows' fill of the same grey
					"& .MuiOutlinedInput-notchedOutline": { borderColor: wave.baseBrighter },
					"&:hover .MuiOutlinedInput-notchedOutline": { borderColor: wave.baseBrightest },
					"&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: wave.contrastDarker, borderWidth: 1 },
				},
			},
		},
		MuiInputBase: {
			styleOverrides: {
				input: {
					// TIDAL's page styles make search inputs border-box, which squeezed MUI's search fields to 20px
					"&[type=search]": { boxSizing: "content-box" },
				},
			},
		},
		MuiSelect: {
			styleOverrides: {
				select: {
					fontWeight: 600,
				},
			},
		},
		// Rounded buttons in sentence case, like TIDAL's
		MuiButton: {
			styleOverrides: {
				root: {
					textTransform: "none",
					borderRadius: 1000,
					fontWeight: 600,
					boxShadow: "none",
					"&:hover": { boxShadow: "none" },
				},
			},
		},
		MuiMenu: {
			styleOverrides: {
				paper: {
					backgroundColor: wave.baseBrighter,
					borderRadius: 8,
				},
			},
		},
		MuiPaper: {
			styleOverrides: {
				root: {
					backgroundColor: wave.baseBright,
					// Dark mode lightens raised paper with a white overlay, TIDAL's surfaces are flat
					backgroundImage: "none",
				},
			},
		},
		// Dialogs on TIDAL's black, so settings panels inside look like the Settings page
		MuiDialog: {
			styleOverrides: {
				paper: {
					backgroundColor: wave.baseFill,
					border: `1px solid ${wave.baseBrighter}`,
					borderRadius: 16,
				},
			},
		},
	},
});

export type MuiThemeOverride = ThemeOptions | ((theme: Theme) => ThemeOptions);

const overrides: { override: MuiThemeOverride }[] = [];
const resolve = () =>
	overrides.reduce<Theme>((theme, { override }) => {
		try {
			return createTheme(theme, typeof override === "function" ? override(theme) : override);
		} catch (err) {
			console.error("[@luna/ui] Failed to apply theme override", err);
			return theme;
		}
	}, lunaMuiTheme);

/** The current Luna theme, lunaMuiTheme with all overrides applied */
const currentTheme = new Signal<Theme>(lunaMuiTheme);

export const MuiTheme = {
	/**
	 * Extend the MUI theme used by Luna Settings and the Luna components (LunaSettings, LunaSwitchSetting...).
	 * Merged on top of lunaMuiTheme in registration order, a function gets the theme built so far.
	 * Applied live, reverted when unloads run.
	 * @example
	 * MuiTheme.override(unloads, {
	 * 	components: {
	 * 		LunaSettings: { styleOverrides: { content: { boxShadow: "none" } } },
	 * 		LunaSetting: { styleOverrides: { root: { minHeight: 36 } } },
	 * 	},
	 * });
	 */
	override(unloads: LunaUnloads, override: MuiThemeOverride) {
		const entry = { override };
		overrides.push(entry);
		currentTheme._ = resolve();
		unloads.add(() => {
			const index = overrides.indexOf(entry);
			if (index === -1) return;
			overrides.splice(index, 1);
			currentTheme._ = resolve();
		});
	},
	get current() {
		return currentTheme._;
	},
	/** Called with the new theme whenever overrides change. Returns a function to stop listening. */
	onChange(listener: (theme: Theme) => void) {
		return currentTheme.onValue(listener);
	},
};

/** ThemeProvider with the current Luna theme (lunaMuiTheme + MuiTheme overrides), updates live */
export const LunaMuiThemeProvider = ({ children }: { children?: React.ReactNode }) => {
	const theme = React.useSyncExternalStore(MuiTheme.onChange, () => currentTheme._);
	return React.createElement(ThemeProvider, { theme }, children);
};
