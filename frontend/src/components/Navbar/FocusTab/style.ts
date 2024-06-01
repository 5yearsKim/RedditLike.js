import { Box, BoxProps } from "@mui/material";
import { styled } from "@mui/material/styles";
import { NAV_HEIGHT } from "@/ui/global";

interface StyledTabProps extends BoxProps {
  focused: boolean;
}

export const StyledTab = styled(Box, {
  shouldForwardProp: (prop) => prop !== "focused",
})<StyledTabProps>(({ focused, theme }) => {
  const primary = theme.palette.primary.main;
  return {
    margin: 5,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    borderColor: focused ? primary : "transparent",
    transition: theme.transitions.create(["color", "border-color"]),
    color: focused ? primary : undefined,
    height: NAV_HEIGHT - 4,
    cursor: "pointer",
    userSelect: "none",
  };
});
