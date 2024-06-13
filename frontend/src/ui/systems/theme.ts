import { PaletteMode } from "@mui/material";
import { createTheme, ThemeOptions, responsiveFontSizes, Theme } from "@mui/material/styles";
import { yellow, green, red, teal, amber, grey } from "@mui/material/colors";
// import { darkScrollbar } from '@mui/material';


const getDesign = (mode: PaletteMode): ThemeOptions => ({
  palette: {
    mode: mode,
    primary: mode == "dark" ? { main: teal["A200"] } : { main: teal["400"] },
    secondary: {
      main: red[500],
    },
    success: {
      light: green[200],
      main: green[400],
      dark: green[600],
    },
    warning: {
      light: amber[200],
      main: amber[400],
      dark: amber[600],
    },
    background: mode == "dark" ?
      { default: "#181E2A" } :
      { default: "#f5f6f7" },
    paper:
      mode == "dark"
        ? {
          light: "#152739",
          main: "#152739",
          dark: "#152739",
          contrastText: "#ffffff",
        }
        : {
          light: "#ffffff",
          main: "#ffffff",
          dark: "#ffffff",
          contrastText: "#000000",
        },
    // custom
    white: {
      main: "#ffffff",
    },
    yellow: {
      light: yellow[300],
      main: yellow[500],
      dark: yellow[700],
      contrastText: "#000000",
    },
    vague:
      mode == "dark"
        ? {
          light: grey[300],
          main: grey[400],
          dark: grey[500],
        }
        : {
          light: grey[500],
          main: grey[600],
          dark: grey[700],
        },
  },
  typography: {
    fontFamily: [
      "Noto Sans KR",
      "-apple-system",
      "BlinkMacSystemFont",
      "\"Segoe UI\"",
      "Roboto",
      "\"Helvetica Neue\"",
      "Arial",
      "sans-serif",
      "\"Apple Color Emoji\"",
      "\"Segoe UI Emoji\"",
      "\"Segoe UI Symbol\"",
    ].join(","),
    h1: { fontWeight: 900 },
    h2: { fontWeight: 900 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
    subtitle1: { fontWeight: 500, fontSize: 18 },
    subtitle2: { fontWeight: 500, fontSize: 16 },
    body1: { fontSize: 16, "@media (max-width: 600px)": { fontSize: 15 } },
    body2: { fontSize: 14, "@media (max-width: 600px)": { fontSize: 13 } },
    body3: { fontSize: 12 },
    button: { fontWeight: 500 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          // ...darkScrollbar(
          //   {
          //     // track: grey[200],
          //     track: 'transparent',
          //     thumb: grey[400],
          //     active: grey[400],
          //   },
          // ),
          //scrollbaWidth
          "& ::-webkit-scrollbar": {
            backgroundColor: "transparent",
            width: "8px",
          },
          "& ::-webkit-scrollbar-thumb": {
            backgroundColor: "#dddddd",
            borderRadius: "8px",
          },
        },
      },
    },
    MuiPaper: { defaultProps: { elevation: 1, sx: { bgcolor: "paper.main" } } },
  },
});

const generateTheme = (isDark: boolean): Theme => {
  return responsiveFontSizes(createTheme(getDesign(isDark ? "dark" : "light")));
};

export { generateTheme };


declare module "@mui/material/styles" {
  interface Palette {
    white: Palette["primary"];
    paper: Palette["primary"];
    vague: Palette["primary"];
  }

  // allow configuration using `createTheme`
  interface PaletteOptions {
    white?: PaletteOptions["primary"];
    paper?: Palette["primary"];
    vague?: PaletteOptions["primary"];
  }

  interface TypographyVariants {
    body3: React.CSSProperties;
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    body3: React.CSSProperties;
  }
}

declare module "@mui/material/styles" {
  interface Palette {
    white: Palette["primary"];
    paper: Palette["primary"];
    yellow: Palette["primary"];
    vague: Palette["primary"];
  }

  // allow configuration using `createTheme`
  interface PaletteOptions {
    white?: PaletteOptions["primary"];
    paper?: Palette["primary"];
    yellow?: Palette["primary"];
    vague?: PaletteOptions["primary"];
  }

  interface TypographyVariants {
    body3: React.CSSProperties;
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    body3: React.CSSProperties;
  }
}

declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    body3: true;
  }
}

// Update the Button's color prop options
declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    white: true;
    vague: true;
  }
}

// Update the Button's color prop options
declare module "@mui/material/IconButton" {
  interface IconButtonPropsColorOverrides {
    white: true;
  }
}
