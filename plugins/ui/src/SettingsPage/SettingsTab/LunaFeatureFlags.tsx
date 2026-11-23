import { redux } from "@luna/lib";
import React from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonBase from "@mui/material/ButtonBase";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchIcon from "@mui/icons-material/Search";

import { useConfirm } from "material-ui-confirm";
import { LunaSwitch } from "../../components";
import { PageHeader } from "../PageHeader";
import { cardGridSx, cardSx, darkField, emptyStateSx, gridCardSx, softButton } from "../styles";
import { FEATURE_FLAG_CATEGORY_ORDER, featureFlagCategory, knownFlagDescription } from "./featureFlagCatalog";

type Filter = "all" | "overridden" | "on" | "off";

const humanize = (name: string) => (name.charAt(0).toUpperCase() + name.slice(1).replaceAll("-", " ")).replace(/\bai\b/gi, "AI");
// TIDAL's own state: flags hold TIDAL's values, userOverrides what the user switched
const subscribe = (notify: () => void) => redux.store.subscribe(notify);
const readFlags = () => redux.store.getState().featureFlags;

/** TIDAL's feature flags as a sub-view of Settings (lunatic-ui had them as their own tab): search, filter by state, overrides marked */
export const LunaFeatureFlags = React.memo(({ switcher }: { switcher: React.ReactNode }) => {
	const confirm = useConfirm();
	const { flags, userOverrides } = React.useSyncExternalStore(subscribe, readFlags);
	const [query, setQuery] = React.useState("");
	const [filter, setFilter] = React.useState<Filter>("all");

	const all = Object.values(flags).map((flag) => {
		const overridden = Object.hasOwn(userOverrides, flag.name);
		return { flag, overridden, value: overridden ? userOverrides[flag.name] : flag.value };
	});
	const search = query.trim().toLocaleLowerCase();
	const visible = all
		.filter(({ flag, overridden, value }) => {
			if (search !== "") {
				const text = `${flag.name} ${humanize(flag.name)} ${knownFlagDescription(flag.name) ?? ""}`.toLocaleLowerCase();
				if (!text.includes(search)) return false;
			}
			if (filter === "overridden") return overridden;
			if (filter === "on") return value;
			if (filter === "off") return !value;
			return true;
		})
		.sort((a, b) => a.flag.name.localeCompare(b.flag.name));
	const overrideCount = all.filter(({ overridden }) => overridden).length;
	// Sections in the catalogue's order, empty ones left out
	const groups = FEATURE_FLAG_CATEGORY_ORDER.map(
		(category) => [category, visible.filter(({ flag }) => featureFlagCategory(flag.name) === category)] as const,
	).filter(([, flags]) => flags.length > 0);
	const [collapsed, setCollapsed] = React.useState<ReadonlySet<string>>(new Set());
	const toggleGroup = (category: string) =>
		setCollapsed((prev) => {
			const next = new Set(prev);
			if (!next.delete(category)) next.add(category);
			return next;
		});

	const toggle = (flag: redux.FeatureFlag, value: boolean) => redux.actions["featureFlags/TOGGLE_USER_OVERRIDE"]({ ...flag, value: !value });
	const resetOverrides = async () => {
		const result = await confirm({
			title: "Reset feature flags",
			description: `Drop your ${overrideCount} override${overrideCount === 1 ? "" : "s"} and go back to TIDAL's values?`,
			confirmationText: "Reset",
		});
		if (result.confirmed) redux.actions["featureFlags/SET_USER_OVERRIDES"]({});
	};

	return (
		<Stack spacing={2.5} sx={{ paddingBottom: 4 }}>
			<PageHeader
				title="Settings"
				subtitle={`TIDAL's internal feature flags and experiments, not Luna features · ${all.length} flags · ${overrideCount} changed by you`}
			/>
			{switcher}
			<Stack direction="row" sx={{ alignItems: "center", gap: 1 }}>
				<TextField
					fullWidth
					size="small"
					type="search"
					placeholder="Search flags"
					sx={darkField}
					value={query}
					onChange={(event) => setQuery(event.target.value)}
					slotProps={{
						htmlInput: { "aria-label": "Search feature flags" },
						input: {
							startAdornment: (
								<InputAdornment position="start">
									<SearchIcon fontSize="small" sx={{ color: "text.secondary" }} />
								</InputAdornment>
							),
						},
					}}
				/>
				<Box sx={{ flexShrink: 0 }}>
					<Select
						variant="standard"
						disableUnderline
						value={filter}
						inputProps={{ "aria-label": "Show flags" }}
						onChange={(event) => setFilter(event.target.value as Filter)}
						sx={{ fontSize: "0.875rem", fontWeight: 600, "& .MuiSelect-icon": { color: "text.secondary" } }}
					>
						<MenuItem value="all">All flags</MenuItem>
						<MenuItem value="overridden">Changed by you</MenuItem>
						<MenuItem value="on">On</MenuItem>
						<MenuItem value="off">Off</MenuItem>
					</Select>
				</Box>
				<Button size="small" sx={softButton()} disabled={overrideCount === 0} onClick={resetOverrides} children="Reset overrides" />
			</Stack>
			{!visible.length && <Typography role="status" variant="body2" sx={emptyStateSx} children="No feature flags match." />}
			{groups.map(([category, flags]) => {
				// A search shows its hits even in a collapsed group
				const open = search !== "" || !collapsed.has(category);
				const changed = flags.filter(({ overridden }) => overridden).length;
				return (
					<Box key={category} component="section" data-luna-feature-flag-group={category} sx={{ ...cardSx, padding: 0 }}>
						<ButtonBase
							aria-expanded={open}
							onClick={() => toggleGroup(category)}
							sx={{ width: "100%", justifyContent: "flex-start", gap: 1, paddingX: 2, paddingY: 1.5, borderRadius: 3, textAlign: "left" }}
						>
							<Typography variant="subtitle1" component="h3" sx={{ fontWeight: 700 }} children={category} />
							<Typography variant="body2" sx={{ color: "text.secondary" }}>
								{flags.length}
								{changed > 0 && <Box component="span" sx={{ color: "info.light" }} children={` · ${changed} changed`} />}
							</Typography>
							<Box sx={{ flexGrow: 1 }} />
							<ExpandMoreIcon sx={{ color: "text.secondary", transition: "transform 150ms", transform: open ? "rotate(180deg)" : "none" }} />
						</ButtonBase>
						{open && (
							<Box sx={{ ...cardGridSx, paddingX: 2, paddingBottom: 2 }}>
								{flags.map(({ flag, overridden, value }) => {
									const description = knownFlagDescription(flag.name);
									return (
										<Stack
											key={flag.name}
											direction="row"
											data-luna-feature-flag={flag.name}
											sx={{
												...gridCardSx,
												alignItems: "center",
												gap: 1,
												paddingY: 1.25,
												borderColor: overridden ? "rgba(144, 202, 249, 0.5)" : gridCardSx.borderColor,
											}}
										>
											<Stack sx={{ minWidth: 0, flexGrow: 1, gap: 0.25 }}>
												<Typography variant="body2" title={flag.name} sx={{ fontWeight: 600, overflowWrap: "anywhere" }} children={humanize(flag.name)} />
												{description && <Typography variant="caption" sx={{ color: "text.secondary", lineHeight: 1.35 }} children={description} />}
												<Typography variant="caption" sx={{ color: overridden ? "info.light" : "rgba(255, 255, 255, 0.5)" }}>
													{overridden ? `Changed by you · TIDAL: ${flag.value ? "on" : "off"}` : `TIDAL default: ${flag.value ? "on" : "off"}`}
												</Typography>
											</Stack>
											<LunaSwitch
												checked={value}
												disabled={flag.type !== "BOOLEAN"}
												onChange={() => toggle(flag, value)}
												slotProps={{ input: { "aria-label": humanize(flag.name) } }}
											/>
										</Stack>
									);
								})}
							</Box>
						)}
					</Box>
				);
			})}
		</Stack>
	);
});
