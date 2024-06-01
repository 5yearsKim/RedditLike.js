"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Dialog, Box, Button, Stack } from "@mui/material";
import { useResponsive } from "@/hooks/Responsive";
import { Txt } from "@/ui/texts";
import { useSnackbar } from "@/hooks/Snackbar";
import { useGroup } from "@/stores/GroupStore";
import { FRONT_URL } from "@/config";
import type { PostT } from "@/types";

type PostShareDialogProps = {
  post: PostT;
  open: boolean;
  onClose: () => void;
};

export function PostShareDialog({
  post,
  open,
  onClose,
}: PostShareDialogProps): JSX.Element {
  const t = useTranslations("components.PostMenuButton.PostShareDialog");

  const { downSm } = useResponsive();
  const { enqueueSnackbar } = useSnackbar();
  const group = useGroup();

  const hostname =
    typeof window !== "undefined" ? `${window.location.protocol}//${window.location.host}` : FRONT_URL;
  const link = `${hostname}/${group.key}/posts/${post.id}`;

  function handleCopyClick(): void {
    navigator.clipboard.writeText(link);
    enqueueSnackbar(t("copiedToClipboard"), { variant: "success" });
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
    >
      <Box
        mx={2}
        my={2}
      >
        <Stack
          width='100%'
          flexDirection={downSm ? "column" : "row"}
          justifyContent='space-between'
          alignItems='center'
          border='1px solid #dddddd'
          borderRadius={2}
          px={2}
          py={1}
        >
          <Txt variant={downSm ? "body3" : "body2"}>{link}</Txt>
          <Box m={1} />
          <Button
            variant='contained'
            sx={{
              borderRadius: 4,
              width: "fit-content",
            }}
            onClick={handleCopyClick}
          >
            {t("copy")}
          </Button>
        </Stack>
      </Box>
    </Dialog>
  );
}
