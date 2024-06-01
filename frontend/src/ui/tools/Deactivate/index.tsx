import React from "react";
import { Box, BoxProps } from "@mui/material";

type DeactivateProps = {
  on: boolean;
};

export function Deactivate(props: BoxProps & DeactivateProps): JSX.Element {
  const { on, ...boxProps } = props;

  if (on) {
    return (
      <Box
        {...boxProps}
        sx={{
          ...boxProps.sx,
          opacity: 0.5,
          pointerEvents: "none",
        }}
      />
    );
  } else {
    return <Box {...boxProps} />;
  }
}
