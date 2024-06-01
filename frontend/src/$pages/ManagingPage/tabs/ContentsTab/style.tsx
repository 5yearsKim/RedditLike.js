import React from "react";
import { Box, BoxProps } from "@mui/material";

export const SectionBox = (props: BoxProps): JSX.Element => {
  // display='flex' flexDirection='column' alignItems='center'
  return (
    <Box
      {...props}
      maxWidth='400px'
      margin='auto'
    />
  );
};
