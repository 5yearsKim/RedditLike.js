import React from "react";
import { Tooltip as MTooltip, TooltipProps as MTooltipProps } from "@mui/material";

interface TooltipProps extends MTooltipProps {
  disabled?: boolean;
}

export function Tooltip({
  disabled,
  ...tooltipProps
}: TooltipProps): JSX.Element {
  if (disabled) {
    return tooltipProps.children;
  }
  return (
    <MTooltip
      enterTouchDelay={0}
      arrow
      placement='top'
      componentsProps={{
        tooltip: {
          sx: {
            fontSize: 12,
          },
        },
      }}
      {...tooltipProps}
    />
  );
}
