"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Dialog } from "@mui/material";
import { Box } from "@/ui/layouts";
import { PollEditor } from "@/components/PollEditor";
import { useSnackbar } from "@/hooks/Snackbar";
import { useAlertDialog } from "@/hooks/dialogs/ConfirmDialog";
import * as PollApi from "@/apis/polls";
import type { PollT, PollFormT, PollCandFormT } from "@/types";


type PollAddDialogProps = {
  open: boolean
  onClose: () => void
  onCreated: (poll: PollT) => void
}

export function PollAddDialog({
  open,
  onClose,
  onCreated,
}: PollAddDialogProps) {
  const t = useTranslations("components.RichEditor2.PollAddDialog");

  const { enqueueSnackbar } = useSnackbar();
  const { showAlertDialog } = useAlertDialog();

  async function handleSubmit(
    form: PollFormT,
    relations: {cands: PollCandFormT[]}
  ): Promise<void> {
    try {
      const created = await PollApi.create(form, relations);
      enqueueSnackbar(t("createPollSuccess"), { variant: "success" });
      onCreated(created);
    } catch (e) {
      console.warn(e);
      enqueueSnackbar(t("createPollFailed"), { variant: "error" });
    }
  }

  async function handleCancel(): Promise<void> {
    const isOk = await showAlertDialog({
      title: t("cancelPoll"),
      body: t("cancelPollMsg"),
      useCancel: true,
      useOk: true,
    });
    if (!isOk) {
      return;
    }
    onClose();
  }

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      maxWidth='sm'
      fullWidth
    >
      <Box px={2} py={1}>
        <PollEditor
          onCancel={handleCancel}
          onSubmit={handleSubmit}
        />
      </Box>
    </Dialog>
  );
}