import { styled, alpha } from "@mui/material/styles";
import { Box, BoxProps } from "@mui/material";

interface FocusableBox extends BoxProps {
  focused: boolean;
}

export const FocusableBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== "focused",
})<FocusableBox>(({ focused }) => {
  return {
    "@keyframes bg-fade-out": {
      from: { backgroundColor: alpha("#ffff00", 0.15) },
      to: { backgroundColor: "transparent" },
    },
    animation: focused ? "bg-fade-out 8s ease-out" : undefined,
  };
});
