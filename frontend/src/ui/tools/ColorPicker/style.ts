import { Box, BoxProps } from "@mui/material";
import { styled } from "@mui/material/styles";

export type ColoredBoxProps = {
  color?: string;
  size?: string;
};

export const ColoredBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== "color",
})<BoxProps & ColoredBoxProps>(
  ({ color, size }) => `
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${color ?? "white"};
  width: ${size ?? "30px"};
  height:  ${size ?? "30px"};
  box-shadow: 0 0 4px rgba(0,0,0,0.25);
  border-radius: 5px;
  cursor: pointer;
`,
);
