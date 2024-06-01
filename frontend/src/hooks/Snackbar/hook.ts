"use client";

import { useSnackbar as _useSnackbar } from "notistack";


export function useSnackbar() {
  const { enqueueSnackbar, closeSnackbar } = _useSnackbar();

  return {
    enqueueSnackbar,
    closeSnackbar,
  };
}

