"use client";
import React, { useMemo, ReactNode } from "react";
import { ThemeProvider, useTheme, createTheme } from "@mui/material/styles";
import { ensureVisible } from "@/utils/color";
import { useGroup } from "@/stores/GroupStore";
import { useStyle$ } from "@/stores/StyleStore";

type GroupThemeProviderProps = {
  children: ReactNode;
};

export function GroupThemeProvider({
  children,
}: GroupThemeProviderProps): ReactNode {

  const style$ = useStyle$();
  const isDark = style$.isDark;
  const group = useGroup();
  const theme = useTheme();
  const groupTheme = useMemo(() => {
    if (!group.theme_color) {
      return null;
    }
    const themeColor = ensureVisible(group.theme_color, theme.palette.mode);

    return createTheme({
      ...theme,
      palette: {
        ...theme.palette,
        primary: {
          main: themeColor,
          contrastText: theme.palette.getContrastText(themeColor),
        },
      },
    });
  }, [group, isDark]);

  if (!groupTheme) {
    return children;
  } else {
    return <ThemeProvider theme={groupTheme}>{children}</ThemeProvider>;
  }
}
