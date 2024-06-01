import React, { MouseEvent } from "react";
import { Box } from "@mui/material";

interface IBProps {
  icon: JSX.Element;
  selected?: boolean;
  onClick: (e: MouseEvent<HTMLElement>) => void;
}

export function IB(props: IBProps): JSX.Element {
  const { icon, selected, onClick } = props;

  return (
    <Box
      pt={0.5}
      px={0.2}
      sx={{
        cursor: "pointer",
        backgroundColor: selected ? "rgba(255, 255, 255, 0.3)" : undefined,
        "&:hover": {
          backgroundColor: "rgba(255, 255, 255, 0.3)",
        },
        color: "#fff",
      }}
      onClick={onClick}
    >
      {icon}
    </Box>
  );
}

interface TBProps {
  icon: JSX.Element;
  label: string;
  selected?: boolean;
  onClick: (e: MouseEvent<HTMLElement>) => void;
}

export function TB(props: TBProps): JSX.Element {
  const { icon, label, selected, onClick } = props;

  return (
    <Box
      display='flex'
      alignItems='center'
      width='120px'
      sx={{
        cursor: "pointer",
        color: "#fff",
        backgroundColor: selected ? "rgba(255, 255, 255, 0.3)" : undefined,
        "&:hover": {
          backgroundColor: "rgba(255, 255, 255, 0.3)",
        },
      }}
      onClick={onClick}
    >
      <Box pl={2}>{icon}</Box>
      <Box
        display='flex'
        justifyContent='center'
        width='100%'
      >
        <span style={{ fontSize: 12, fontWeight: 500 }}>{label}</span>
      </Box>
    </Box>
  );
}
