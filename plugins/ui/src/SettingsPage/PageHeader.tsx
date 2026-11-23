import React from "react";

import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

/** Title + one line under it, the same on every Luna Settings tab */
export const PageHeader = ({ title, subtitle, highlight }: { title: string; subtitle?: React.ReactNode; highlight?: boolean }) => (
	<Stack spacing={0.25}>
		<Typography variant="h5" sx={{ fontWeight: 700 }} children={title} />
		{subtitle && <Typography variant="body2" sx={{ color: highlight ? "info.light" : "text.secondary" }} children={subtitle} />}
	</Stack>
);
