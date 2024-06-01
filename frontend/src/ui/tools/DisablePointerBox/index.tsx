import React from "react";
import { Box, BoxProps } from "@mui/material";

interface DisablePointerBoxProps extends BoxProps {
  blockPointer: boolean;
}

export function DisablePointerBox(props: DisablePointerBoxProps): JSX.Element {
  const { blockPointer, ...boxProps } = props;
  return (
    <Box
      {...boxProps}
      sx={{
        ...boxProps.sx,
        pointerEvents: blockPointer ? "none" : undefined,
      }}
    />
  );
}
