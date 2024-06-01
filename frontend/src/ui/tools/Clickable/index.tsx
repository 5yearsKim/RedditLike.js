import React, { ReactNode } from "react";
import { ButtonBase } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { Box, type BoxProps } from "@/ui/layouts";
import { MouseEvent } from "react";

export interface ClickableProps extends BoxProps {
  children: ReactNode;
  disabled?: boolean;
  overflow?: BoxProps["overflow"];
  onClick?: (e: MouseEvent<HTMLElement>) => void;
}


export function Clickable({
  children,
  disabled,
  overflow = "hidden",
  onClick,
  ...boxProps
}: ClickableProps): ReactNode{

  const theme = useTheme();
  const isMobile = false;

  if (disabled) {
    return (
      <Box
        display='flex'
        {...boxProps}
      >
        {children}
      </Box>
    );
  }

  return (
    <Box
      onClick={onClick}
      display='flex'
      justifyContent='center'
      alignItems='center'
      position='relative'
      overflow={"overflow"}
      {...boxProps}
      sx={{
        cursor: "pointer",
        userSelect: "none",
        transition: theme.transitions.create(["background-color"], {
          duration: theme.transitions.duration.short,
        }),
        "&:hover": {
          bgcolor: isMobile ? undefined : alpha("#888888", 0.2),
        },
        ...boxProps.sx,
      }}
    >
      <ButtonBase
        aria-label={boxProps["aria-label"]}
        sx={{ width: "100%", height: "100%", position: "absolute" }}
      />
      {children}
    </Box>
  );
}
