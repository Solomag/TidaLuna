import type { CSSObject } from "@mui/material/styles";
import type React from "react";

/**
 * TIDAL's own design tokens ("wave" CSS variables on :root), so Luna follows TIDAL's colours if TIDAL changes them.
 * The fallbacks are TIDAL's values at the time, used if a variable goes away.
 */
export const wave = {
	/** Page background */
	baseFill: "var(--wave-color-solid-base-fill, #000)",
	/** Panel borders, row dividers, fields */
	baseBright: "var(--wave-color-solid-base-bright, #18181b)",
	baseBrighter: "var(--wave-color-solid-base-brighter, #242429)",
	/** Switch track when off */
	baseBrightest: "var(--wave-color-solid-base-brightest, #303036)",
	/** Settings rows */
	rowFill: "var(--wave-color-opacity-base-bright-thick, #18181b99)",
	contrastFill: "var(--wave-color-solid-contrast-fill, #fff)",
	/** Switch track when on */
	contrastDark: "var(--wave-color-solid-contrast-dark, #e4e4e7)",
	contrastDarker: "var(--wave-color-solid-contrast-darker, #afafb6)",
	textMain: "var(--wave-color-text-main, #fff)",
	textSecondary: "var(--wave-color-text-secondary, #afafb6)",
	textTertiary: "var(--wave-color-text-tertiary, #787887)",
} as const;

/** TIDAL's Settings panel: rounded border around rows with a dark fill, divided by inset lines */
export const panelStyles: CSSObject = {
	border: `1px solid ${wave.baseBright}`,
	borderRadius: 16,
	backgroundColor: "transparent",
	boxShadow: "none",
	padding: 0,
	overflow: "hidden",
	"&:empty": { display: "none" },
	// Every child is a row. :where keeps this as weak as the panel's own class, so a child's own background or padding wins
	// (buttons placed straight in the panel keep their own look)
	"&:where(:not(.LunaSettings-row)) > :where(:not(.MuiButtonBase-root))": { backgroundColor: wave.rowFill, padding: 16 },
	// Divider above every row but the first, 16px in from both sides like TIDAL's
	"&:where(:not(.LunaSettings-row)) > :where(* + :not(.MuiButtonBase-root))": {
		backgroundImage: `linear-gradient(${wave.baseBright}, ${wave.baseBright})`,
		backgroundSize: "calc(100% - 32px) 1px",
		backgroundPosition: "16px 0",
		backgroundRepeat: "no-repeat",
	},
	// direction="row": the whole panel is one row with its children side by side
	"&.LunaSettings-row": { backgroundColor: wave.rowFill, padding: 16, gap: 16 },
	// A panel inside a row (a section nested in a section) is a plain list in that row, not a second frame
	"& .LunaSettings-content": { border: "none", borderRadius: 0 },
	"& .LunaSettings-content:where(:not(.LunaSettings-row)) > :where(:not(.MuiButtonBase-root))": {
		backgroundColor: "transparent",
		paddingLeft: 0,
		paddingRight: 0,
	},
	"& .LunaSettings-content:where(:not(.LunaSettings-row)) > :where(* + :not(.MuiButtonBase-root))": {
		backgroundSize: "100% 1px",
		backgroundPosition: "0 0",
	},
	"& .LunaSettings-content.LunaSettings-row": { backgroundColor: "transparent", paddingLeft: 0, paddingRight: 0 },
};

/** TIDAL's setting titles and descriptions */
export const rowTitleStyles: React.CSSProperties = { fontSize: 14, fontWeight: 600, lineHeight: "20px", color: wave.textMain };
export const rowDescStyles: React.CSSProperties = {
	fontSize: 12,
	fontWeight: 500,
	lineHeight: "18px",
	letterSpacing: "0.18px",
	color: wave.textSecondary,
};
