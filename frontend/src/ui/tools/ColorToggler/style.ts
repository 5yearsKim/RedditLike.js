import { Box, BoxProps } from "@mui/material";
import { styled } from "@mui/material/styles";

export type ToggleBoxProps = {
  isDark?: boolean;
  size?: string;
};

export const ToggleBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isDark" && prop !== "size",
})<BoxProps & ToggleBoxProps>(
  ({ isDark, size }) => `
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${size ?? "30px"};
  height:  ${size ?? "30px"};
  box-shadow: 0 0 4px rgba(0,0,0,0.25);
  border-radius: 5px;
  cursor: pointer;

  // custom for below

  user-select: none;
  background-color: #888888;
  transition: background-color 0.3s ease;
  transition: color 0.3s ease;
  ${
  isDark
    ? `
    color: #222222;
    background-color: #dddddd;
    `
    : `
    color: white;
    background-color: #888888;
    `
}
`,
);
