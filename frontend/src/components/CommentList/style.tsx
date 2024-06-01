import React from "react";
import { Typography, TypographyProps } from "@mui/material";

export function MainTxt(props: TypographyProps): JSX.Element {
  return (
    <Typography
      color='black'
      textOverflow='ellipsis'
      display='inline'
      sx={{
        fontWeight: 500,
        cursor: "pointer",
        color: "main.contrastText",
        "&:hover": {
          fontWeight: 700,
        },
      }}
      {...props}
    />
  );
}
