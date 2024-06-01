import React from "react";
import { CircularProgress, Box, type BoxProps } from "@mui/material";

interface LoadingIndicatorProps extends BoxProps {
  size?: string;
}

export function LoadingIndicator({
  size,
  ...boxProps
}: LoadingIndicatorProps): JSX.Element {

  return (
    <Box
      display='flex'
      justifyContent='center'
      width='100%'
      {...boxProps}
    >
      <CircularProgress size={size} />
    </Box>
  );
}
