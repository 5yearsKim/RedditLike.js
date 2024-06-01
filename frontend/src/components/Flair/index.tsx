import React from "react";
import { useTheme } from "@mui/material";
import { Box } from "@/ui/layouts";
import { FlairFormT, FlairT } from "@/types/Flair";

type FlairProps = {
  flair: FlairFormT | FlairT;
  size: "lg" | "md" | "sm";
};

export function Flair({
  flair,
  size,
}: FlairProps): JSX.Element {
  const theme = useTheme();

  const bgC = flair.bg_color;
  const textC = flair.text_color ?? theme.palette.text.primary;

  let px = 0;
  let py = 0;
  let fontSize = 16;
  switch (size) {
  case "lg": {
    px = 1;
    py = 0.5;
    fontSize = 16;
    break;
  }
  case "md": {
    px = 0.6;
    py = 0.3;
    fontSize = 14;
    break;
  }
  case "sm": {
    px = 0.6;
    py = 0.0;
    fontSize = 11;
    break;
  }
  default:
    break;
  }

  if (!bgC) {
    px = 0;
  }

  return (
    <Box
      px={px}
      py={py}
      borderRadius={2}
      width='fit-content'
      height='fit-content'
      whiteSpace='nowrap'
      sx={{
        ...(bgC
          ? {
            backgroundColor: bgC,
            boxShadow: "0 0 3px rgba(0,0,0,0.2)",
          }
          : {}),
        userSelect: "none",
        fontSize: fontSize,
        fontWeight: 500,
        color: textC ?? theme.palette.getContrastText(bgC ?? "#ffffff"),
      }}
    >
      {flair.label}
    </Box>
  );
}
