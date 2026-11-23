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
