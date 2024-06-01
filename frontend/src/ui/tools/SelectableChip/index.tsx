import React, { MouseEvent, ReactNode } from "react";
import { Chip } from "@mui/material";

type SelectableChipProps = {
  selected: boolean;
  label: string;
  icon?: any;
  selectedColor?: "primary" | "secondary";
  borderRadius?: string | number;
  size?: "medium" | "small";
  onClick?: (e: MouseEvent<HTMLElement>) => any;
};

export function SelectableChip({
  selected,
  label,
  icon,
  selectedColor,
  borderRadius,
  size,
  onClick,
}: SelectableChipProps): ReactNode {

  return (
    <Chip
      size={size}
      variant='filled'
      color={selected ? selectedColor ?? "primary" : undefined}
      icon={icon}
      label={label}
      onClick={onClick}
      sx={{
        py: size == "small" ? 1.75 : undefined,
        borderRadius: borderRadius,
      }}
    />
  );
}
