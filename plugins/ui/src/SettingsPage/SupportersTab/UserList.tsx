import Grid from "@mui/material/Grid";
import React from "react";
import { LunaAuthorDisplay } from "../../components";

type User = {
	login: string;
	avatarUrl: string;
	url: string;
};

export const UserList = React.memo(({ users }: { users: User[] }) => (
	<Grid
		spacing={2}
		container
		sx={{
			display: "grid",
			gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
			"@media (max-width: 1100px)": { gridTemplateColumns: "repeat(3, minmax(0, 1fr))" },
			"@media (max-width: 820px)": { gridTemplateColumns: "repeat(2, minmax(0, 1fr))" },
			"@media (max-width: 560px)": { gridTemplateColumns: "minmax(0, 1fr)" },
		}}
	>
		{users.map(({ login, avatarUrl, url }) => (
			<Grid key={login} sx={{ minWidth: 0 }}>
				<LunaAuthorDisplay
					sx={{
						width: "100%",
						minWidth: 0,
						boxSizing: "border-box",
						flexDirection: "row",
						justifyContent: "space-between",
						alignItems: "center",
						gap: 1,
						background: "rgba(0, 0, 0, 0.1)",
						borderRadius: 2,
						padding: 1,
						"& .MuiTypography-root": {
							minWidth: 0,
							overflow: "hidden",
							textOverflow: "ellipsis",
							whiteSpace: "nowrap",
						},
						"& .MuiAvatar-root": {
							flex: "0 0 auto",
							marginLeft: "auto",
						},
					}}
					author={{ name: login, avatarUrl, url }}
					prefix=""
				/>
			</Grid>
		))}
	</Grid>
));
