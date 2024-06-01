import React, { MouseEvent } from "react";
import { Box, ButtonBase } from "@mui/material";
import { darken } from "@mui/material/styles";
import { DashboardOlIcon } from "@/ui/icons";
import { Row } from "@/ui/layouts";
import { Txt } from "@/ui/texts";

type RangeButtonProps = {
  bgcolor: string;
  color: string;
  label: string;
  size?: "medium" | "small";
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
};

export function RangeButton(props: RangeButtonProps): JSX.Element {
  const { size, color, bgcolor, label, onClick } = props;

  return (
    <ButtonBase
      onClick={onClick}
      sx={{
        color: color,
        bgcolor: bgcolor,
        borderRadius: 8,
        px: size == "small" ? 1.2 : 1.2,
        py: size == "small" ? 0.8 : 0.6,
        m: 0,
        whiteSpace: "nowrap",
        "&:hover": {
          bgcolor: darken(bgcolor, 0.05),
        },
      }}
    >
      <Row>
        <DashboardOlIcon sx={{ fontSize: size == "small" ? 17 : 18 }} />
        <Box mr={0.5} />
        <Txt
          fontWeight={500}
          variant={size == "small" ? "body2" : "body1"}
        >
          {label}
        </Txt>
      </Row>
    </ButtonBase>
  );
}
