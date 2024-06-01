import { styled } from "@mui/material/styles";
import { Box, BoxProps } from "@mui/material";

type PreviewBoxProps = BoxProps & { selected?: boolean };

export const PreviewBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== "selected",
})<PreviewBoxProps>(({ theme, selected }) => {
  return {
    position: "relative",
    border: `solid 2px ${selected ? theme.palette.primary.main : "#cccccc"}`,
    borderRadius: "2px",
    width: "100px",
    height: "100px",
    [theme.breakpoints.down("sm")]: {
      width: "80px",
      height: "80px",
    },
    // width: { sm: '80px', md: '100px' },
    // height: { sm: '80px', md: '100px' },
  };
});
