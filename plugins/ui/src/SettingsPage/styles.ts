import type { SxProps, Theme } from "@mui/material/styles";

/** Styles for TIDAL's black background (Luna's MUI theme is light mode, so outlines and hovers default to black) */

export const surface = "rgba(255, 255, 255, 0.05)";
export const surfaceHover = "rgba(255, 255, 255, 0.09)";
export const hairline = "rgba(255, 255, 255, 0.1)";

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
	"&:hover": { boxShadow: "none", backgroundColor: "rgba(255, 255, 255, 0.82)" },
	"&.Mui-disabled": { backgroundColor: "rgba(255, 255, 255, 0.3)", color: "rgba(0, 0, 0, 0.6)" },
} satisfies SxProps<Theme>;

/** Grey pill, white when active (filters, toggles) */
export const softButton = (active = false) =>
	({
		...pillButton,
		backgroundColor: active ? "#fff" : "rgba(255, 255, 255, 0.08)",
		color: active ? "#000" : "text.primary",
		"&:hover": { boxShadow: "none", backgroundColor: active ? "rgba(255, 255, 255, 0.82)" : "rgba(255, 255, 255, 0.14)" },
		"&.Mui-disabled": { color: "rgba(255, 255, 255, 0.35)" },
	}) satisfies SxProps<Theme>;

/** Rounded dark text field */
export const darkField = {
	"& .MuiOutlinedInput-root": {
		borderRadius: 999,
		backgroundColor: "rgba(255, 255, 255, 0.08)",
		"& .MuiOutlinedInput-notchedOutline": { borderColor: "transparent" },
		"&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255, 255, 255, 0.25)" },
		"&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255, 255, 255, 0.6)", borderWidth: 1 },
	},
	"& .MuiInputBase-input::placeholder": { color: "text.secondary", opacity: 1 },
	"& .MuiInputLabel-root:not(.Mui-focused):not(.MuiInputLabel-shrink)": { color: "text.secondary" },
} satisfies SxProps<Theme>;

/** Small tag on a card */
export const tag = { height: 22, fontSize: "0.7rem", fontWeight: 600, borderColor: hairline } satisfies SxProps<Theme>;

/** Panel on the black background: cards, settings sections */
export const cardSx = { borderRadius: 3, border: "1px solid", borderColor: hairline, backgroundColor: surface, padding: 2 } as const;

/** Grid of plugin and theme cards (Marketplace and Installed): 4 columns on the full-width page */
export const cardGridSx = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 2 } satisfies SxProps<Theme>;

/** A card in that grid, a bit lighter on hover */
export const gridCardSx = {
	...cardSx,
	minWidth: 0,
	transition: "background-color 120ms, border-color 120ms",
	"&:hover": { backgroundColor: surfaceHover, borderColor: "rgba(255, 255, 255, 0.18)" },
} satisfies SxProps<Theme>;

/** Status line under a grid or list: nothing installed, nothing matches */
export const emptyStateSx = { color: "text.secondary", paddingY: 4, textAlign: "center" } satisfies SxProps<Theme>;

/**
 * Turns the top-level LunaSettings sections of a page into cards with the title inside (Settings and Supporters tabs).
 * Scoped to direct children, so plugin settings nested inside keep their own look.
 */
export const sectionCardsSx = {
	"& > .LunaSettings-root": { ...cardSx, paddingBottom: 1.5 },
	"& > .LunaSettings-root > .LunaSettings-content": { backgroundColor: "transparent", boxShadow: "none", padding: 0 },
	"& > .LunaSettings-root > .LunaTitle-root .LunaTitle-title": { fontWeight: 700, fontSize: "1.1rem" },
	"& > .LunaSettings-root > .LunaTitle-root .LunaTitle-desc": { color: "text.secondary", fontWeight: 400 },
	// Pill buttons like the rest of the page instead of MUI's uppercase ones
	"& > .LunaSettings-root .MuiButton-root": { textTransform: "none", borderRadius: 999, fontWeight: 600, boxShadow: "none" },
} satisfies SxProps<Theme>;
