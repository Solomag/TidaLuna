import React from "react";

import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

import { softButton } from "./styles";

/** Pill switch between the views of one tab (Plugins | Themes, General | Feature flags) */
export const ViewSwitch = <T extends string>({
	value,
	options,
	onChange,
	label,
}: {
	value: T;
	options: readonly { value: T; label: string }[];
	onChange: (value: T) => void;
	/** Accessible name of the group */
	label: string;
}) => (
	<Stack direction="row" role="group" aria-label={label} sx={{ gap: 1 }}>
		{options.map((option) => (
			<Button
				key={option.value}
				size="small"
				aria-pressed={value === option.value}
				sx={softButton(value === option.value)}
				onClick={() => onChange(option.value)}
				children={option.label}
			/>
		))}
	</Stack>
);

/** Keeps a component in sync with a Signal holding the current view */
export const useSignalValue = <T,>(signal: { _: T; onValue: (cb: (value: T) => void) => () => unknown }) => {
	const [value, setValue] = React.useState(signal._);
	React.useEffect(() => {
		setValue(signal._);
		const unload = signal.onValue(setValue);
		return () => void unload();
	}, [signal]);
	return value;
};
