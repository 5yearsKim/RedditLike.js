import React from "react";
import { Box, Row } from "@/ui/layouts";
import { HelperTooltip } from "@/ui/tools/HelperTooltip";
import { useTheme } from "@mui/material";
import type { FlagT, FlagFormT } from "@/types/Flag";

type FlagProps = {
  flag: FlagFormT | FlagT;
  size?: "small" | "medium";
  showTip?: boolean;
};

export function Flag({
  flag,
  size,
  showTip,
}: FlagProps): JSX.Element {
  const bgC = flag.bg_color;
  const textC = flag.text_color;

  let px = 0.8;
  let py = 0.2;
  let fontSize = 14;

  if (size == "small") {
    px = 0.6;
    py = 0.15;
    fontSize = 12;
  }

  const theme = useTheme();

  return (
    <Row>
      <Box
        px={px}
        py={py}
        borderRadius={(px + py) * 2.5}
        width='fit-content'
        whiteSpace='nowrap'
        fontSize={fontSize}
        sx={{
          color: textC ?? theme.palette.getContrastText(bgC ?? "#ffffff"),
          userSelect: "none",
          fontWeight: 500,
          ...(bgC
            ? {
              backgroundColor: bgC,
              boxShadow: "0 0 4px rgba(0,0,0,0.1)",
            }
            : {}),
        }}
      >
        {flag.label}
      </Box>
      {showTip && flag.description && (
        <Box mx={0.5}>
          <HelperTooltip tip={flag.description} />
        </Box>
      )}
    </Row>
  );
}
