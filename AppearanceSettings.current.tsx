import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
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

function ColorField({
	label,
	value,
	onChange,
}: {
	label: string;
	value: string;
	onChange: (value: string) => void;
}) {
	const pickerRef = React.useRef<HTMLInputElement>(null);
	return (
		<Box sx={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 38px", gap: .75, minWidth: 0 }}>
			<TextField label={label} value={value} size="small" fullWidth onChange={(event) => onChange(event.target.value)} />
			<Button
				title={`Pick ${label.toLowerCase()}`}
				aria-label={`Pick ${label.toLowerCase()}`}
				onClick={() => pickerRef.current?.click()}
				sx={{
					minWidth: 38,
					width: 38,
					padding: 0,
					border: "1px solid rgba(255,255,255,.18)",
					background: value,
					"&:hover": { background: value, filter: "brightness(1.15)" },
				}}
			/>
			<input
				ref={pickerRef}
				type="color"
				defaultValue={cssColorToPicker(value)}
				onChange={(event) => onChange(event.currentTarget.value)}
				style={{ position: "absolute", width: 1, height: 1, opacity: 0, pointerEvents: "none" }}
			/>
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
