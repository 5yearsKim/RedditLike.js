import { Box, type BoxProps } from "@mui/material";
import { styled } from "@mui/material/styles";

interface HoverableBoxProps extends BoxProps {
  boxShadow?: string;
}

export const HoverableBox = styled(Box, {
  shouldForwardProp: (prop) => prop != "boxShadow",
})<HoverableBoxProps>(({ theme, boxShadow }) => {
  return {
    boxShadow: boxShadow ?? "0px 5px 10px 0px rgba(0, 0, 0, 0.1)",
    transition: theme.transitions.create(["box-shadow", "transform"]),
    cursor: "pointer",
    userSelect: "none",
    "&:hover": {
      boxShadow: "0px 5px 10px 0px rgba(0, 0, 0, 0.2)",
      transform: "translate(1px, -2px)",
    },
  };
});
