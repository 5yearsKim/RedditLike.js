import React from "react";
import { useTranslations } from "next-intl";
import { useConfirmDialog } from "./hook";
import { DialogTitle, DialogContent, DialogContentText } from "@mui/material";

export interface AlertDialogT {
  title?: string;
  body: string;
  useOk?: boolean;
  useCancel?: boolean;
  dismissible?: boolean;
  themeDisabled?: boolean;
}

export function useAlertDialog() {
  const { showConfirmDialog } = useConfirmDialog();

  function showAlertDialog(option: AlertDialogT): Promise<null | boolean> {
    const { title, body, useOk, useCancel, dismissible, themeDisabled } = option;
    const main = (
      <>
        {Boolean(title) && <DialogTitle>{title}</DialogTitle>}
        <DialogContent>
          <DialogContentText>{body}</DialogContentText>
        </DialogContent>
      </>
    );
    return showConfirmDialog({
      main,
      useOk,
      useCancel,
      dismissible,
      themeDisabled,
    });
  }

  return {
    showAlertDialog,
  };
}

export interface LoginAlertDialogT {
  themeDisabled?: boolean;
}

export function useLoginAlertDialog({ themeDisabled }: LoginAlertDialogT = {}) {
  const t = useTranslations("hooks.dialogs.ConfirmDialog");
  const { showAlertDialog } = useAlertDialog();

  async function showLoginAlertDialog(): Promise<void> {
    await showAlertDialog({
      body: t("loginOnlyMsg"),
      useOk: true,
      themeDisabled,
    });
  }


  return {
    showLoginAlertDialog,
  };
}
