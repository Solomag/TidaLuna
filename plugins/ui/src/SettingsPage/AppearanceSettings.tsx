import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Popover from "@mui/material/Popover";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { LunaSettings } from "../components";

import {
	defaultLunaUiAppearance,
	setLunaUiAppearance,
	useLunaUiAppearance,
	type LunaUiAppearance,
} from "../appearance";

function cssColorToPicker(value: string) {
	if (/^#[0-9a-f]{6}$/i.test(value)) return value;
	if (/^#[0-9a-f]{3}$/i.test(value)) return `#${value.slice(1).split("").map((c) => c + c).join("")}`;
	return "#808080";
}

function hsvToHex(h: number, s: number, v: number) {
	const c = v * s;
	const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
	const m = v - c;
	let r = 0, g = 0, b = 0;
	if (h < 60) [r, g, b] = [c, x, 0];
	else if (h < 120) [r, g, b] = [x, c, 0];
	else if (h < 180) [r, g, b] = [0, c, x];
	else if (h < 240) [r, g, b] = [0, x, c];
	else if (h < 300) [r, g, b] = [x, 0, c];
	else [r, g, b] = [c, 0, x];
	return `#${[r, g, b].map((n) => Math.round((n + m) * 255).toString(16).padStart(2, "0")).join("")}`;
}

function colorAlpha(value: string) {
	const rgba = value.match(/^rgba?\(\s*[\d.]+\s*,\s*[\d.]+\s*,\s*[\d.]+(?:\s*,\s*([\d.]+))?\s*\)$/i);
	if (rgba) return rgba[1] === undefined ? 1 : Math.max(0, Math.min(1, Number(rgba[1])));
	if (/^#[0-9a-f]{8}$/i.test(value)) return parseInt(value.slice(7, 9), 16) / 255;
	return 1;
}

function hexToHsv(value: string) {
	const hex = cssColorToPicker(value).slice(1);
	const r = parseInt(hex.slice(0, 2), 16) / 255;
	const g = parseInt(hex.slice(2, 4), 16) / 255;
	const b = parseInt(hex.slice(4, 6), 16) / 255;
	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);
	const d = max - min;
	let h = 0;
	if (d) {
		if (max === r) h = 60 * (((g - b) / d) % 6);
		else if (max === g) h = 60 * ((b - r) / d + 2);
		else h = 60 * ((r - g) / d + 4);
	}
	if (h < 0) h += 360;
	return { h, s: max ? d / max : 0, v: max };
}

function ColorField({
	label,
	value,
	onChange,
}: {
	label: string;
	value: string;
	onChange: (value: string) => void;
}) {
	const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
	const svRef = React.useRef<HTMLDivElement>(null);
	const svCursorRef = React.useRef<HTMLDivElement>(null);
	const hueRef = React.useRef<HTMLDivElement>(null);
	const hueCursorRef = React.useRef<HTMLDivElement>(null);
	const alphaCursorRef = React.useRef<HTMLDivElement>(null);
	const swatchRef = React.useRef<HTMLButtonElement>(null);
	const hsvRef = React.useRef(hexToHsv(value));
	const alphaRef = React.useRef(colorAlpha(value));
	const pendingRef = React.useRef(cssColorToPicker(value));

	const paint = React.useCallback(() => {
		const { h, s, v } = hsvRef.current;
		const hex = hsvToHex(h, s, v);
		const alpha = alphaRef.current;
		const r = parseInt(hex.slice(1, 3), 16);
		const g = parseInt(hex.slice(3, 5), 16);
		const b = parseInt(hex.slice(5, 7), 16);
		const next = alpha >= .999 ? hex : `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(2)})`;
		pendingRef.current = next;
		if (swatchRef.current) swatchRef.current.style.backgroundColor = next;
		if (svRef.current) svRef.current.style.backgroundColor = `hsl(${h} 100% 50%)`;
		if (svCursorRef.current) {
			svCursorRef.current.style.left = `${s * 100}%`;
			svCursorRef.current.style.top = `${(1 - v) * 100}%`;
		}
		if (hueCursorRef.current) hueCursorRef.current.style.left = `${(h / 360) * 100}%`;
		if (alphaCursorRef.current) alphaCursorRef.current.style.left = `${alpha * 100}%`;
	}, []);

	React.useEffect(() => {
		hsvRef.current = hexToHsv(value);
		alphaRef.current = colorAlpha(value);
		pendingRef.current = value;
		paint();
	}, [paint, value]);

	const commit = React.useCallback(() => onChange(pendingRef.current), [onChange]);

	const updateSv = React.useCallback((event: React.PointerEvent<HTMLDivElement>) => {
		const rect = event.currentTarget.getBoundingClientRect();
		hsvRef.current.s = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
		hsvRef.current.v = 1 - Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
		paint();
	}, [paint]);

	const updateHue = React.useCallback((event: React.PointerEvent<HTMLDivElement>) => {
		const rect = event.currentTarget.getBoundingClientRect();
		hsvRef.current.h = Math.max(0, Math.min(359.999, ((event.clientX - rect.left) / rect.width) * 360));
		paint();
	}, [paint]);

	const updateAlpha = React.useCallback((event: React.PointerEvent<HTMLDivElement>) => {
		const rect = event.currentTarget.getBoundingClientRect();
		alphaRef.current = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
		paint();
	}, [paint]);

	return (
		<Box sx={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 38px", gap: .75, minWidth: 0 }}>
			<TextField label={label} value={value} size="small" fullWidth onChange={(event) => onChange(event.target.value)} />
			<Button
				ref={swatchRef}
				title={`Pick ${label.toLowerCase()}`}
				aria-label={`Pick ${label.toLowerCase()}`}
				onClick={(event) => setAnchorEl(event.currentTarget)}
				sx={{ minWidth: 38, width: 38, padding: 0, border: "1px solid rgba(255,255,255,.18)", background: value, "&:hover": { filter: "brightness(1.15)" } }}
			/>
			<Popover
				open={Boolean(anchorEl)}
				anchorEl={anchorEl}
				onClose={() => { commit(); setAnchorEl(null); }}
				anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
				transformOrigin={{ vertical: "top", horizontal: "right" }}
				slotProps={{ paper: { sx: { padding: 1.25, width: 240, overflow: "visible" } } }}
			>
				<Box
					ref={svRef}
					onPointerDown={(event) => {
						event.currentTarget.setPointerCapture(event.pointerId);
						updateSv(event);
					}}
					onPointerMove={(event) => {
						if (event.currentTarget.hasPointerCapture(event.pointerId)) updateSv(event);
					}}
					onPointerUp={(event) => {
						if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
						commit();
					}}
					sx={{
						position: "relative",
						height: 150,
						cursor: "crosshair",
						touchAction: "none",
						backgroundColor: `hsl(${hsvRef.current.h} 100% 50%)`,
						backgroundImage: "linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, transparent)",
					}}
				>
					<Box ref={svCursorRef} sx={{ position: "absolute", width: 12, height: 12, border: "2px solid white", borderRadius: "50%", boxShadow: "0 0 0 1px black", transform: "translate(-50%, -50%)", pointerEvents: "none" }} />
				</Box>
				<Box
					ref={hueRef}
					onPointerDown={(event) => {
						event.currentTarget.setPointerCapture(event.pointerId);
						updateHue(event);
					}}
					onPointerMove={(event) => {
						if (event.currentTarget.hasPointerCapture(event.pointerId)) updateHue(event);
					}}
					onPointerUp={(event) => {
						if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
						commit();
					}}
					sx={{ position: "relative", height: 18, marginTop: 1, cursor: "ew-resize", touchAction: "none", background: "linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)" }}
				>
					<Box ref={hueCursorRef} sx={{ position: "absolute", top: -2, bottom: -2, width: 4, border: "1px solid black", background: "white", transform: "translateX(-50%)", pointerEvents: "none" }} />
				</Box>
				<Box sx={{ display: "flex", alignItems: "center", gap: 1, marginTop: 1 }}>
					<Typography variant="subtitle2" sx={{ width: 42 }}>Alpha</Typography>
					<Box
						onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); updateAlpha(event); }}
						onPointerMove={(event) => { if (event.currentTarget.hasPointerCapture(event.pointerId)) updateAlpha(event); }}
						onPointerUp={(event) => {
							if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
							commit();
						}}
						sx={{
							position: "relative",
							flex: 1,
							height: 18,
							cursor: "ew-resize",
							touchAction: "none",
							backgroundImage: "linear-gradient(to right, transparent, currentColor), linear-gradient(45deg, #777 25%, transparent 25%, transparent 75%, #777 75%), linear-gradient(45deg, #777 25%, #aaa 25%, #aaa 75%, #777 75%)",
							backgroundSize: "100% 100%, 8px 8px, 8px 8px",
							backgroundPosition: "0 0, 0 0, 4px 4px",
							color: pendingRef.current,
						}}
					>
						<Box ref={alphaCursorRef} sx={{ position: "absolute", top: -2, bottom: -2, width: 4, border: "1px solid black", background: "white", transform: "translateX(-50%)", pointerEvents: "none" }} />
					</Box>
				</Box>
			</Popover>
		</Box>
	);
}

function CompactField({
	label,
	value,
	onChange,
	type = "text",
}: {
	label: string;
	value: string | number;
	onChange: (value: string) => void;
	type?: string;
}) {
	return <TextField label={label} value={value} type={type} size="small" fullWidth onChange={(event) => onChange(event.target.value)} />;
}

function ToggleRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
	return (
		<Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", minHeight: 40, padding: "0 4px 0 10px", border: "1px solid rgba(255,255,255,.10)", borderRadius: 1 }}>
			<Typography variant="subtitle2">{label}</Typography>
			<Switch size="small" checked={checked} onChange={(_, value) => onChange(value)} />
		</Box>
	);
}

function backgroundSize(a: LunaUiAppearance) {
	if (a.backgroundZoom <= 100) return a.backgroundFit;
	if (a.backgroundFit === "contain") return `auto ${a.backgroundZoom}%`;
	return `${a.backgroundZoom}% auto`;
}

function AppearancePreview({ a }: { a: LunaUiAppearance }) {
	const radius = `${Math.max(0, Number(a.borderRadius) || 0)}px`;
	const icon = (label: string, color: string) => (
		<Box title={label} sx={{ width: 28, height: 28, display: "grid", placeItems: "center", color, border: `1px solid ${a.borderColor}`, borderRadius: radius, fontWeight: 800 }}>
			в—Џ
		</Box>
	);
	return (
		<Box
			sx={{
				position: "sticky",
				top: 12,
				minHeight: 390,
				padding: 2,
				borderRadius: radius,
				backgroundColor: a.pageBackground,
				backgroundImage: a.pageBackgroundImage ? `url("${a.pageBackgroundImage}")` : "none",
				backgroundSize: backgroundSize(a),
				backgroundPosition: `${a.backgroundPositionX}% ${a.backgroundPositionY}%`,
				backgroundRepeat: "no-repeat",
				border: `1px solid ${a.borderColor}`,
				color: a.textColor,
				overflow: "hidden",
			}}
		>
			<Typography variant="h7" sx={{ color: a.textColor }}>Page background</Typography>
			<Typography variant="subtitle2" sx={{ color: a.mutedTextColor, marginBottom: 1.5 }}>Muted text</Typography>
			<Box sx={{ padding: 1.5, borderRadius: radius, background: a.shellBackground, border: `1px solid ${a.borderColor}`, opacity: a.surfaceOpacity / 100 }}>
				<Typography variant="h8" sx={{ color: a.textColor }}>Section background</Typography>
				<Box sx={{ marginTop: 1.25, padding: 1.25, borderRadius: radius, background: a.cardBackground, border: `1px solid ${a.borderColor}` }}>
					<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
						{!a.hideAuthorAvatars && <Box sx={{ width: 24, height: 24, borderRadius: "50%", background: a.strongBorderColor }} />}
						<Box sx={{ minWidth: 0, flex: 1 }}>
							<Typography sx={{ color: a.textColor, fontWeight: 700 }}>Card background</Typography>
							<Typography variant="subtitle2" sx={{ color: a.mutedTextColor }}>Author / secondary text</Typography>
						</Box>
						<Box sx={{ display: "flex", gap: .5 }}>
							{icon("Reload icon", a.singleIconColor ? a.iconColor : a.reloadIconColor)}
							{icon("Live reload icon", a.singleIconColor ? a.iconColor : a.liveReloadIconColor)}
							{icon("Settings icon", a.singleIconColor ? a.iconColor : a.settingsIconColor)}
							{icon("Uninstall icon", a.singleIconColor ? a.iconColor : a.uninstallIconColor)}
						</Box>
					</Box>
					<Box sx={{ marginTop: 1, padding: 1, borderRadius: radius, background: a.innerBackground, border: `1px solid ${a.strongBorderColor}` }}>
						<Typography variant="subtitle2" sx={{ color: a.mutedTextColor }}>Inner background</Typography>
						<Box sx={{ display: "flex", gap: 1, marginTop: .75 }}>
							<Box sx={{ flex: 1, height: 34, borderRadius: radius, background: a.controlBackground, border: `1px solid ${a.borderColor}`, display: "grid", alignItems: "center", paddingLeft: 1, color: a.mutedTextColor }}>Control background</Box>
							<Box sx={{ width: 64, height: 34, borderRadius: radius, background: a.controlBackground, border: `1px solid ${a.strongBorderColor}` }} />
						</Box>
					</Box>
				</Box>
			</Box>
		</Box>
	);
}

export const Settings = React.memo(() => {
	const saved = useLunaUiAppearance();
	const [draft, setDraft] = React.useState<LunaUiAppearance>(() => ({ ...saved }));
	const fileRef = React.useRef<HTMLInputElement>(null);

	React.useEffect(() => {
		setDraft({ ...saved });
	}, [saved]);

	const updateDraft = React.useCallback(<K extends keyof LunaUiAppearance>(key: K, value: LunaUiAppearance[K]) => {
		setDraft((current) => ({ ...current, [key]: value }));
	}, []);

	const loadBackgroundImage = React.useCallback((file?: File) => {
		if (!file) return;
		const reader = new FileReader();
		reader.onload = () => updateDraft("pageBackgroundImage", String(reader.result ?? ""));
		reader.readAsDataURL(file);
	}, [updateDraft]);

	const dirty = React.useMemo(() => JSON.stringify(draft) !== JSON.stringify(saved), [draft, saved]);

	const save = React.useCallback(() => {
		for (const key of Object.keys(draft) as (keyof LunaUiAppearance)[]) {
			if (draft[key] !== saved[key]) setLunaUiAppearance(key, draft[key] as never);
		}
	}, [draft, saved]);

	const discard = React.useCallback(() => setDraft({ ...saved }), [saved]);
	const resetDraft = React.useCallback(() => setDraft({ ...defaultLunaUiAppearance }), []);

	return (
		<LunaSettings
			title="Appearance"
			desc="Edit the preview freely, then apply the complete appearance to TIDALuna Settings in one step."
		>
			<Box sx={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(320px, .95fr)", gap: 2, alignItems: "start", "@media (max-width: 950px)": { gridTemplateColumns: "1fr" } }}>
				<Stack spacing={1.5}>
					<Box>
						<Typography variant="h8">Background</Typography>
						<Typography variant="subtitle2" sx={{ opacity: .7, marginBottom: 1 }}>
							For images, 16:9 at 1920Г—1080 or larger is recommended. WebP/JPEG is preferable for smaller stored settings.
						</Typography>
						<Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 1 }}>
							<ColorField label="Page background" value={draft.pageBackground} onChange={(v) => updateDraft("pageBackground", v)} />
							<Box sx={{ display: "flex", gap: .75 }}>
								<Button variant="outlined" size="small" sx={{ flex: 1 }} onClick={() => fileRef.current?.click()}>Choose image</Button>
								{draft.pageBackgroundImage && <Button size="small" onClick={() => updateDraft("pageBackgroundImage", "")}>Clear</Button>}
								<input ref={fileRef} hidden type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={(e) => loadBackgroundImage(e.target.files?.[0])} />
							</Box>
							<TextField select label="Image fit" size="small" value={draft.backgroundFit} onChange={(e) => updateDraft("backgroundFit", e.target.value as LunaUiAppearance["backgroundFit"])}>
								<MenuItem value="cover">Cover / crop</MenuItem>
								<MenuItem value="contain">Contain</MenuItem>
								<MenuItem value="auto">Original size</MenuItem>
							</TextField>
							<CompactField label="Image zoom %" type="number" value={draft.backgroundZoom} onChange={(v) => updateDraft("backgroundZoom", Math.max(25, Math.min(400, Number(v) || 100)))} />
							<CompactField label="Crop position X %" type="number" value={draft.backgroundPositionX} onChange={(v) => updateDraft("backgroundPositionX", Math.max(0, Math.min(100, Number(v) || 0)))} />
							<CompactField label="Crop position Y %" type="number" value={draft.backgroundPositionY} onChange={(v) => updateDraft("backgroundPositionY", Math.max(0, Math.min(100, Number(v) || 0)))} />
						</Box>
					</Box>

					<Box>
						<Typography variant="h8" sx={{ display: "block", marginBottom: 1 }}>Surfaces вЂ” names match preview</Typography>
						<Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 1 }}>
							<ColorField label="Section background" value={draft.shellBackground} onChange={(v) => updateDraft("shellBackground", v)} />
							<ColorField label="Card background" value={draft.cardBackground} onChange={(v) => updateDraft("cardBackground", v)} />
							<ColorField label="Inner background" value={draft.innerBackground} onChange={(v) => updateDraft("innerBackground", v)} />
							<ColorField label="Control background" value={draft.controlBackground} onChange={(v) => updateDraft("controlBackground", v)} />
							<ColorField label="Border color" value={draft.borderColor} onChange={(v) => updateDraft("borderColor", v)} />
							<ColorField label="Strong border color" value={draft.strongBorderColor} onChange={(v) => updateDraft("strongBorderColor", v)} />
							<ColorField label="Text color" value={draft.textColor} onChange={(v) => updateDraft("textColor", v)} />
							<ColorField label="Muted text" value={draft.mutedTextColor} onChange={(v) => updateDraft("mutedTextColor", v)} />
							<CompactField label="Corner radius px" type="number" value={draft.borderRadius} onChange={(v) => updateDraft("borderRadius", Math.max(0, Number(v) || 0))} />
							<CompactField label="Surface opacity %" type="number" value={draft.surfaceOpacity} onChange={(v) => updateDraft("surfaceOpacity", Math.max(0, Math.min(100, Number(v) || 0)))} />
						</Box>
					</Box>

					<Box>
						<Typography variant="h8" sx={{ display: "block", marginBottom: 1 }}>Plugin chrome</Typography>
						<Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 1 }}>
							<ToggleRow label="Hide author avatars" checked={draft.hideAuthorAvatars} onChange={(v) => updateDraft("hideAuthorAvatars", v)} />
							<ToggleRow label="Use one icon color" checked={draft.singleIconColor} onChange={(v) => updateDraft("singleIconColor", v)} />
							{draft.singleIconColor ? (
								<ColorField label="All action icons" value={draft.iconColor} onChange={(v) => updateDraft("iconColor", v)} />
							) : (
								<>
									<ColorField label="Reload icon" value={draft.reloadIconColor} onChange={(v) => updateDraft("reloadIconColor", v)} />
									<ColorField label="Live reload icon" value={draft.liveReloadIconColor} onChange={(v) => updateDraft("liveReloadIconColor", v)} />
									<ColorField label="Settings icon" value={draft.settingsIconColor} onChange={(v) => updateDraft("settingsIconColor", v)} />
									<ColorField label="Uninstall icon" value={draft.uninstallIconColor} onChange={(v) => updateDraft("uninstallIconColor", v)} />
								</>
							)}
						</Box>
					</Box>

					<Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap", paddingTop: .5 }}>
						<Button variant="contained" disabled={!dirty} onClick={save}>Save changes</Button>
						<Button variant="outlined" disabled={!dirty} onClick={discard}>Discard changes</Button>
						<Button size="small" onClick={resetDraft}>Reset to defaults</Button>
						{dirty && <Typography variant="subtitle2" sx={{ opacity: .7, marginLeft: .5 }}>Unsaved changes</Typography>}
					</Box>
				</Stack>
				<AppearancePreview a={draft} />
			</Box>
		</LunaSettings>
	);
});
