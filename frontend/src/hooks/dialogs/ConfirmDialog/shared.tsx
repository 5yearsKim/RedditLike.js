"use client";

import React, { Fragment } from "react";
import { useTranslations } from "next-intl";
import { Button, Dialog, DialogActions } from "@mui/material";
import { BoardThemeProvider } from "@/ui/tools/BoardThemeProvider";
// logic
import { useRecoilState } from "recoil";
import { confirmDialogState } from "./state";
import { useBoardMain$ } from "@/stores/BoardMainStore";

export function ConfirmDialogShared(): JSX.Element {
  const t = useTranslations("hooks.dialogs.ConfirmDialog");
  const [baseDialog, setBaseDialog] = useRecoilState(confirmDialogState);

  const {
    isOpen,
    main,
    useOk,
    useCancel,
    dismissible,
    themeDisabled,
    onOk,
    onCancel,
    onDismiss,
  } = baseDialog;

  const boardMain$ = useBoardMain$();

  function handleOkClick(): void {
    setBaseDialog({
      ...baseDialog,
      isOpen: false,
    });
    if (onOk) {
      onOk();
    }
  }
  function handleCancelClick(): void {
    setBaseDialog({
      ...baseDialog,
      isOpen: false,
    });
    if (onCancel) {
      onCancel();
    }
  }

  function handleDismissClick(): void {
    if (dismissible === false) {
      return;
    }
    setBaseDialog({
      ...baseDialog,
      isOpen: false,
    });
    if (onDismiss) {
      onDismiss();
    }
  }

  return (
    <Dialog
      open={isOpen}
      onClose={handleDismissClick}
      sx={{
        zIndex: 1800,
        minWidth: "300px",
        // https://mui.com/material-ui/customization/z-index/
      }}
    >
      <BoardThemeProvider board={themeDisabled ? null : boardMain$.data?.board ?? null}>
        <Fragment>
          {main}

          <DialogActions>
            {useCancel && (
              <Button onClick={handleCancelClick}>
                {t("cancel")}
              </Button>
            )
            }

            {useOk && (
              <Button
                variant='contained'
                onClick={handleOkClick}
              >
                {t("ok")}
              </Button>
            )}
          </DialogActions>
        </Fragment>
      </BoardThemeProvider>
    </Dialog>
  );
}
