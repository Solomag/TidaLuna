import React from "react";

import type { TypographyProps } from "@mui/material";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { styled, useThemeProps, type CSSObject, type Theme } from "@mui/material/styles";
import type { LunaStackProps } from "./LunaStack";
import { LunaTitle } from "./LunaTitle";

/**
 * Creates a LunaStack like component that is themeable via theme.components[name] (slots root, spacer, content)
 * and has the stable classes `${name}-root`, `${name}-spacer` and `${name}-content`.
 */
export const createLunaStack = (
	name: "LunaStack" | "LunaSettings",
	defaultVariant?: TypographyProps["variant"],
	contentStyles: (theme: Theme) => CSSObject = () => ({}),
	defaultSpacing = 1,
	rootStyles: CSSObject = {},
) => {
	const Root = styled(Box, { name, slot: "Root" })(rootStyles);
	const Spacer = styled("div", { name, slot: "Spacer" })({ height: 8 });
	const Content = styled(Stack, { name, slot: "Content" })(({ theme }) => contentStyles(theme));

	const Component = React.memo((inProps: LunaStackProps) => {
		const props = useThemeProps({ props: inProps, name });
		const { title, desc, variant = defaultVariant, titleChildren, ...stackProps } = props;
		// `${name}-row` lets styles tell side by side content from a list of rows (responsive directions count if row at any size)
		const { direction } = stackProps;
		const isRow = direction === "row" || (typeof direction === "object" && direction !== null && Object.values(direction).includes("row"));
		const contentClass = [`${name}-content`, isRow && `${name}-row`, stackProps.className].filter(Boolean).join(" ");
		return (
			<Root className={`${name}-root`}>
				{title && <LunaTitle variant={variant} title={title} desc={desc} children={titleChildren} />}
				<Spacer className={`${name}-spacer`} />
				<Content spacing={defaultSpacing} {...stackProps} className={contentClass} />
			</Root>
		);
	});
	Component.displayName = name;
	return Component;
};
