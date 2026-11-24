import type { SxProps, Theme } from "@mui/material/styles";

import { panelStyles, wave } from "../wave";

/** Styles for the Luna pages in TIDAL's look, from TIDAL's own colour variables */

/** Fill of cards and rows, like the rows of TIDAL's Settings */
export const surface = wave.rowFill;
export const surfaceHover = wave.baseBright;
/** Card and panel borders */
export const hairline = wave.baseBright;

export const pillButton = {
	textTransform: "none",
	borderRadius: 999,
	fontWeight: 600,
	paddingX: 2,
	boxShadow: "none",
	whiteSpace: "nowrap",
	flexShrink: 0,
	"&:hover": { boxShadow: "none" },
	"&.Mui-disabled": { color: "rgba(255, 255, 255, 0.35)" },
} satisfies SxProps<Theme>;

/** White pill for the main action, like TIDAL's own buttons */
export const primaryButton = {
	...pillButton,
	backgroundColor: "#fff",
	color: "#000",
	"&:hover": { boxShadow: "none", backgroundColor: wave.contrastDark },
	"&.Mui-disabled": { backgroundColor: wave.baseBrightest, color: wave.textTertiary },
} satisfies SxProps<Theme>;

/** Grey pill, white when active (filters, toggles) */
export const softButton = (active = false) =>
	({
		...pillButton,
		backgroundColor: active ? wave.contrastFill : wave.baseBrighter,
		color: active ? wave.baseFill : wave.textMain,
		"&:hover": { boxShadow: "none", backgroundColor: active ? wave.contrastDark : wave.baseBrightest },
		"&.Mui-disabled": { color: "rgba(255, 255, 255, 0.35)" },
	}) satisfies SxProps<Theme>;

/** Rounded dark text field */
export const darkField = {
	"& .MuiOutlinedInput-root": {
		borderRadius: 999,
		backgroundColor: wave.baseBright,
		"& .MuiOutlinedInput-notchedOutline": { borderColor: "transparent" },
		"&:hover .MuiOutlinedInput-notchedOutline": { borderColor: wave.baseBrightest },
		"&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: wave.contrastDarker, borderWidth: 1 },
	},
	"& .MuiInputBase-input::placeholder": { color: "text.secondary", opacity: 1 },
	"& .MuiInputLabel-root:not(.Mui-focused):not(.MuiInputLabel-shrink)": { color: "text.secondary" },
} satisfies SxProps<Theme>;

/** Small tag on a card */
export const tag = { height: 22, fontSize: "0.7rem", fontWeight: 600, borderColor: wave.baseBrightest } satisfies SxProps<Theme>;

/** Card on the black background, bordered and filled like TIDAL's Settings panels */
export const cardSx = { borderRadius: "16px", border: "1px solid", borderColor: hairline, backgroundColor: surface, padding: 2 } as const;

/** Grid of plugin and theme cards (Marketplace and Installed): 4 columns on the full-width page */
export const cardGridSx = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 2 } satisfies SxProps<Theme>;

/** A card in that grid, a bit lighter on hover */
export const gridCardSx = {
	...cardSx,
	minWidth: 0,
	transition: "background-color 120ms, border-color 120ms",
	"&:hover": { backgroundColor: surfaceHover, borderColor: wave.baseBrighter },
} satisfies SxProps<Theme>;

/** Status line under a grid or list: nothing installed, nothing matches */
export const emptyStateSx = { color: "text.secondary", paddingY: 4, textAlign: "center" } satisfies SxProps<Theme>;

/** TIDAL's Settings panel for rows that aren't LunaSettings, each direct child is a row */
export const panelSx = panelStyles;
