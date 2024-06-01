"use client";

import React, { ReactNode } from "react";
import { SnackbarProvider as _SnackbarProvider, closeSnackbar } from "notistack";
import { useResponsive } from "@/hooks/Responsive";
import { IconButton } from "@mui/material";
import { CloseIcon } from "@/ui/icons";

export function SnackbarProvider({ children }: {children: ReactNode}) {
  const { downSm } = useResponsive();

  return (
    <_SnackbarProvider
      maxSnack={3}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      autoHideDuration={downSm ? 2000 : 3000}
      action={(snackId) => {
        if (downSm) {
          return (
            <button
              onClick={() => closeSnackbar(snackId)}
              style={{
                // visibility: 'hidden',
                opacity: 0,
                height: "100%",
                left: 0,
                position: "absolute",
                top: 0,
                width: "100%",
              }}
            />
          );
        } else {
          return (
            <IconButton
              color='white'
              size='small'
              onClick={() => {
                closeSnackbar(snackId);
              }}>
              <CloseIcon/>
            </IconButton>
          );
        }
      }}
    >
      {children}
    </_SnackbarProvider>
  );
}