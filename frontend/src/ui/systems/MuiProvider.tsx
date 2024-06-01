"use client";

import React, { useEffect, useMemo } from "react";
// import { CacheProvider } from "@emotion/react";
// import { emotionCache } from "@/system/emotion_cache";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { generateTheme } from "./theme";
import { useStyle$ , useStyleActions } from "@/stores/StyleStore";

export function MuiProvider({ children }: { children: JSX.Element }): JSX.Element {
  const style$ = useStyle$();
  const styleAct = useStyleActions();

  useEffect(() => {
    const localIsDark = localStorage.getItem("isDark");
    if (localIsDark) {
      if (localIsDark == "true") {
        styleAct.patch({ isDark: true });
      }
      if (localIsDark == "false") {
        styleAct.patch({ isDark: false });
      }
    }
  }, []);

  // const isPreferDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  // const prefersDarkMode = false;

  const isDark = style$.isDark ?? false;
  // const isDark = isPreferDarkMode;

  const theme = useMemo(() => {
    return generateTheme(isDark);
  }, [isDark]);

  return (
    // <CacheProvider value={emotionCache}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
    // </CacheProvider>
  );
}
