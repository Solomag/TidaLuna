import React from "react";

import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import Typography from "@mui/material/Typography";

import { hairline, surface, surfaceHover } from "../styles";

type User = {
	login: string;
	avatarUrl: string;
	url: string;
};

/** Search text from the Supporters tab, sections filter their users by it */
export const SupportersQuery = React.createContext("");

/** Avatar tiles in a grid, filtered by the Supporters search */
// Urls come from the GitHub API and sponsors.hug.rip, only web profiles are opened (like LunaLink)
const isWebUrl = (url: string) => {
	const protocol = URL.parse(url)?.protocol;
	return protocol === "https:" || protocol === "http:";
};

/** `incomplete`: more users load on scroll, so a search can miss them */
export const UserList = React.memo(({ users, incomplete }: { users: User[]; incomplete?: boolean }) => {
	const query = React.useContext(SupportersQuery).trim().toLocaleLowerCase();
	const shown = query ? users.filter(({ login }) => login.toLocaleLowerCase().includes(query)) : users;
	if (query && users.length && !shown.length)
		return (
			<Typography
				variant="body2"
				sx={{ color: "text.secondary" }}
				children={incomplete ? "No one matches among the ones loaded so far. Scroll down to load more." : "No one matches."}
			/>
		);
	return (
		<Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 1 }}>
			{shown.map(({ login, avatarUrl, url }) => (
				<ButtonBase
					key={`${login}:${url}`}
					title={`Visit ${login}'s profile`}
					disabled={!isWebUrl(url)}
					onClick={() => window.open(url, "_blank")}
					sx={{
						justifyContent: "flex-start",
						gap: 1,
						padding: 0.75,
						borderRadius: 2,
						minWidth: 0,
						backgroundColor: surface,
						border: `1px solid ${hairline}`,
						"&:hover": { backgroundColor: surfaceHover },
					}}
				>
					<Avatar src={avatarUrl} alt="" sx={{ width: 28, height: 28 }} />
					<Typography variant="body2" noWrap sx={{ fontWeight: 600, minWidth: 0 }} children={login} />
				</ButtonBase>
			))}
		</Box>
	);
});
