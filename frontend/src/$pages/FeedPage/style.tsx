import React from "react";
import { Box } from "@mui/material";

type SideBoxProps = {
  children: JSX.Element | JSX.Element[];
};

export function SideBox(props: SideBoxProps): JSX.Element {
  const { children } = props;
  return (
    <Box
      bgcolor='paper.main'
      borderRadius={2}
      boxShadow='0px 0px 10px 0px rgba(0, 0, 0, 0.0)'
      overflow='hidden'
    >
      {children}
    </Box>
  );
}
