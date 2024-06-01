import React from "react";
import { Typography, TypographyProps } from "@mui/material";

export function InfoTxt(props: TypographyProps): JSX.Element {
  return (
    <Typography
      variant='body3'
      fontSize={10}
      fontWeight={500}
      whiteSpace='nowrap'
      {...props}
    />
  );
}
