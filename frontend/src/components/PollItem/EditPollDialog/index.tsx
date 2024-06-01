"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Dialog } from "@mui/material";
import { Box } from "@/ui/layouts";
import { PollEditor } from "@/components/PollEditor";
import { useSnackbar } from "@/hooks/Snackbar";
import { useAlertDialog } from "@/hooks/dialogs/ConfirmDialog";
import * as PollApi from "@/apis/polls";
import type { PollT, PollFormT, PollCandT, PollCandFormT } from "@/types";

type EditPollDialogProps = {
  poll: PollT
  cands: PollCandT[]
  open: boolean
  onClose: () => void
  onUpdated: (poll: PollT) => void
}

export function EditPollDialog({
  poll,
  cands,
  open,
  onClose,
  onUpdated,
}: EditPollDialogProps): JSX.Element {
  const t = useTranslations("components.PollItem.EditPollDialog");

  const { enqueueSnackbar } = useSnackbar();
  const { showAlertDialog } = useAlertDialog();

  async function handleCancel(): Promise<void> {
    const isOk = await showAlertDialog({
      title: t("cancelEdit") ,
      body: t("cancelEditMsg"),
      useCancel: true,
      useOk: true,
    });
    if (!isOk) {
      return;
    }
    onClose();
  }

  async function handleSubmit(
    form: PollFormT,
    relations: {cands: PollCandFormT[]}
  ): Promise<void> {
    try {

      const updated = await PollApi.update(poll.id, form, relations);

      enqueueSnackbar(t("editSuccess"), { variant: "success" });
      onUpdated(updated);
      onClose();
    } catch (e) {
      console.warn(e);
      enqueueSnackbar(t("editFailed"), { variant: "error" });
    }
  }

  return (
    <Dialog open={open} onClose={handleCancel}>
      <Box px={2} py={1}>
        <PollEditor
          pollInfo={{ poll, cands }}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </Box>
    </Dialog>
  );
}