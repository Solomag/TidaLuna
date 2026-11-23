import React from "react";

import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import { red } from "@mui/material/colors";

import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

import { LunaSwitch } from "../../components";

/** Bottom row of an installed plugin or theme card: on/off switch, extra buttons, and a menu with the rest (like Spicetify's cards) */
export const CardActions = ({
	name,
	enabled,
	loading,
	onToggle,
	children,
	menu,
}: {
	name: string;
	/** undefined: can't be turned off (core plugins) */
	enabled?: boolean;
	loading?: boolean;
	onToggle?: (event: unknown, checked: boolean) => unknown;
	/** Buttons between the switch and the menu */
	children?: React.ReactNode;
	/** Menu items, `close` closes the menu */
	menu: (close: () => void) => React.ReactNode[];
}) => {
	const [anchor, setAnchor] = React.useState<HTMLElement | null>(null);
	const close = () => setAnchor(null);
	return (
		<>
			{enabled !== undefined && (
				<Tooltip
					title={enabled ? `Turn off ${name}` : `Turn on ${name}`}
					children={
						<Box sx={{ marginLeft: -1 }}>
							<LunaSwitch checked={enabled} loading={loading} onChange={onToggle} slotProps={{ input: { "aria-label": `${name} on` } }} />
						</Box>
					}
				/>
			)}
			<Box sx={{ flexGrow: 1 }} />
			{children}
			<Tooltip title="More">
				<IconButton
					size="small"
					aria-label={`More actions for ${name}`}
					aria-haspopup="menu"
					aria-expanded={anchor !== null}
					sx={{ color: "text.secondary" }}
					onClick={(event) => setAnchor(event.currentTarget)}
					children={<MoreHorizIcon />}
				/>
			</Tooltip>
			<Menu
				anchorEl={anchor}
				open={anchor !== null}
				onClose={close}
				anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
				transformOrigin={{ vertical: "top", horizontal: "right" }}
				children={menu(close)}
			/>
		</>
	);
};

export const UninstallMenuItem = ({ label, onClick }: { label: string; onClick: () => void }) => (
	<MenuItem onClick={onClick} sx={{ color: red[300] }}>
		<ListItemIcon children={<DeleteOutlineIcon fontSize="small" sx={{ color: red[300] }} />} />
		{label}
	</MenuItem>
);
