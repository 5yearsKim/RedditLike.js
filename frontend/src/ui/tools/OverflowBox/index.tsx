import React, { ReactNode } from "react";
import { Box, BoxProps } from "@mui/material";

interface OverflowBoxProps extends BoxProps {
  maxHeight: string | number;
  shadeHeight?: string;
  hideColor: string;
  children: ReactNode;
}

export function OverflowBox({
  maxHeight: _maxHeight,
  shadeHeight: _shadeHeight,
  hideColor,
  children,
  ...boxProps

}: OverflowBoxProps): JSX.Element {
  const maxHeight = typeof _maxHeight == "string" ? _maxHeight : `${_maxHeight}px`;
  const shadeHeight = _shadeHeight ?? "60px";

  return (
    <Box
      position='relative'
      {...boxProps}
      overflow='hidden'
      maxHeight={maxHeight}
    >
      {children}
      <Box
        position='absolute'
        top={`calc(${maxHeight} - ${shadeHeight})`}
        height={shadeHeight}
        width='100%'
        sx={{
          background: `linear-gradient(transparent, ${hideColor})`,
          // background: 'green',
        }}
      />
    </Box>
  );
}
