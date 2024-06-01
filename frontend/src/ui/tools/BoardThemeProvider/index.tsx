"use client";
import React, { useMemo, ReactNode } from "react";
import { ThemeProvider, useTheme, createTheme } from "@mui/material/styles";
import { ensureVisible } from "@/utils/color";
import type { BoardT } from "@/types/Board";

export type BoardThemeProviderProps = {
  board: BoardT | null;
  children: ReactNode;
};

export function BoardThemeProvider({
  board,
  children,
}: BoardThemeProviderProps): ReactNode {

  const theme = useTheme();

  const boardTheme = useMemo(() => {
    if (!board || !board.use_theme) {
      return null;
    }
    const themeColor = ensureVisible(board.theme_color ?? theme.palette.primary.main, theme.palette.mode);

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
  }, [board]);

  if (!boardTheme) {
    return children;
  } else {
    return <ThemeProvider theme={boardTheme}>{children}</ThemeProvider>;
  }
}
