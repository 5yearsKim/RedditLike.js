import { styled } from "@mui/material/styles";
import { IconButton, IconButtonProps } from "@mui/material";

export const CircleIconButton = styled(IconButton)<IconButtonProps>(() => {
  return {
    backgroundColor: "rgba(20, 20, 20, 0.4)",
    color: "white",
    "&:hover": {
      backgroundColor: "rgba(20, 20, 20, 0.6)",
    },
  };
});
