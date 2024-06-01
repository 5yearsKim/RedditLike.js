"use client";
import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Dialog, Button, TextField } from "@mui/material";
import { Box, Gap, Row } from "@/ui/layouts";
import { Txt } from "@/ui/texts";

type DeleteReasonDialogProps = {
  open: boolean
  onClose: () => void
  onSubmit: (reason: string) => void
}

export function DeleteReasonDialog({
  open,
  onClose,
  onSubmit,
}: DeleteReasonDialogProps) {
  const t = useTranslations("components.ManagingSection.DeleteReasonDialog");
  const [reason, setReason] = useState<string>("");

  function handleSubmit(): void {
    onSubmit(reason);
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
    >
      <Box
        display='flex'
        flexDirection='column'
        px={2}
        py={2}
        minWidth={{ xs: undefined, sm: 400 }}
        onClick={(e) => e.stopPropagation()}
      >
        <Txt
          variant='subtitle1'
          fontWeight={700}
        >
          {t("typeReason")}
        </Txt>

        <Gap y={1} />

        <TextField
          variant='standard'
          label={t("trashReason")}
          multiline
          minRows={2}
          maxRows={5}
          placeholder={t("trashReasonHelper")}
          fullWidth
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
        <Gap y={2} />
        <Row justifyContent='flex-end'>
          <Button
            onClick={onClose}
          >
            {t("cancel")}
          </Button>
          <Button
            variant='contained'
            onClick={handleSubmit}
          >
            {t("trash")}
          </Button>
        </Row>
      </Box>
    </Dialog>
  );
}