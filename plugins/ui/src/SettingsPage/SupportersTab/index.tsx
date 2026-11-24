import React from "react";

import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

import SearchIcon from "@mui/icons-material/Search";

import { PageHeader } from "../PageHeader";
import { darkField } from "../styles";
import { GitHubContributors } from "./GitHubContributors";
import { GitHubSponsors } from "./GitHubSponsors";
import { GitHubStars } from "./GitHubStars";
import { SupportersQuery } from "./UserList";

export const SupportersTab = React.memo(() => {
	const [query, setQuery] = React.useState("");
	return (
		<Stack spacing={4} sx={{ paddingBottom: 4 }}>
			<PageHeader title="Supporters" subtitle="The people who keep TIDALuna going ❤️" />
			<TextField
				fullWidth
				size="small"
				type="search"
				placeholder="Search supporters"
				sx={darkField}
				value={query}
				onChange={(event) => setQuery(event.target.value)}
				slotProps={{
					htmlInput: { "aria-label": "Search supporters" },
					input: {
						startAdornment: (
							<InputAdornment position="start">
								<SearchIcon fontSize="small" sx={{ color: "text.secondary" }} />
							</InputAdornment>
						),
					},
				}}
			/>
			<SupportersQuery.Provider value={query}>
				<GitHubSponsors />
				<GitHubContributors />
				<GitHubStars />
			</SupportersQuery.Provider>
		</Stack>
	);
});
