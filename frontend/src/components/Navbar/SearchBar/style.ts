import { styled, alpha } from "@mui/material/styles";
import { InputBase } from "@mui/material";

type SearchProps = {
  focused?: boolean;
};

export const Search = styled("div", {
  shouldForwardProp: (prop) => prop !== "focused",
})<SearchProps>(({ theme, focused }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha("rgba(150, 150, 150, 0.6)", 0.1),
  "&:hover": {
    backgroundColor: alpha("rgba(150, 150, 150, 0.7)", 0.2),
  },
  display: "flex",
  width: "100%",
  transition: theme.transitions.create("max-width"),
  flex: 1,
  maxWidth: focused ? "500px" : "300px",
  [theme.breakpoints.down("sm")]: {
    maxWidth: "300px",
  },
}));

export const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 1),
  height: "100%",
  // position: 'absolute',
  pointerEvents: "none",
  margin: "auto",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}));

export const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  flexGrow: 4,
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1),
    // vertical padding + font size from searchIcon
    // paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    width: "100%",
  },
}));
