import React, { Fragment } from "react";
import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Expand } from "@/ui/layouts";
import { Txt } from "@/ui/texts";

export type SideBoxProps = {
  key?: string;
  title: string;
  children: JSX.Element;
  actions?: JSX.Element[];
};

export function SideBox(props: SideBoxProps): JSX.Element {
  const { key, title, children, actions } = props;
  const theme = useTheme();
  return (
    <Box
      key={key}
      mb={2}
      bgcolor={theme.palette.primary.main}
      borderRadius={1}
      // border={1}
      // borderColor='paper.main'
      boxShadow='0 0 4px 2px rgba(0, 0, 0, 0.1)'
    >
      <Box
        minHeight='35px'
        display='flex'
        px={1.5}
        alignItems='center'
      >
        <Txt
          fontWeight={700}
          color={theme.palette.primary.contrastText}
        >
          {title}
        </Txt>

        {actions && (
          <Fragment>
            <Expand />
            {actions}
          </Fragment>
        )}
      </Box>
      <Box bgcolor='paper.main'>{children}</Box>
    </Box>
  );
}

export function BoardBgBox(): JSX.Element {
  const theme = useTheme();
  return (
    <Box
      bgcolor={theme.palette.primary.main}
      borderRadius={1}
      boxShadow='0 0 4px 2px rgba(0, 0, 0, 0.1)'
    />
  );
}

