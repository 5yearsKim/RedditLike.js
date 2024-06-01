"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Box, Button } from "@mui/material";
import { Row } from "@/ui/layouts";
import { useSnackbar } from "@/hooks/Snackbar";
import { RichEditor2, CommentDisableFeatures } from "@/components/RichEditor2";
import * as CommentApi from "@/apis/comments";
import type { CommentT } from "@/types";

type CommentModifierProps = {
  comment: CommentT;
  onModified: (comment: CommentT) => void;
  onCancel: () => void;
};

export function CommentModifier({
  comment,
  onModified,
  onCancel,
}: CommentModifierProps): JSX.Element {
  const t = useTranslations("components.CommentItem.CommentModifier");
  const [body, setBody] = useState<string>(_getInitialBody());

  const { enqueueSnackbar } = useSnackbar();

  function _getInitialBody(): string {
    if (comment.body_type == "md") {
      return `<p>${comment.body}</p>`;
    }
    return comment.body ?? "";
  }

  function handleBodyChange(newVal: string): void {
    setBody(newVal);
  }

  function handleCancelClick(): void {
    onCancel();
  }

  async function handleSubmit(): Promise<void> {
    try {
      const updated = await CommentApi.update(comment.id, {
        body_type: "html",
        body: body,
      });
      enqueueSnackbar(t("editSuccess"), { variant: "success" });
      onModified(updated);
    } catch (e) {
      enqueueSnackbar(t("editFailed"), { variant: "error" });
    }
  }

  return (
    <Box
      width='100%'
      px={1}
    >
      <RichEditor2
        value={body}
        onChange={handleBodyChange}
        disableFeatures={CommentDisableFeatures}
        className='comment-editor-specific'
      />
      <Row justifyContent='flex-end'>
        <Button
          size='small'
          onClick={handleCancelClick}
        >
          {t("cancel")}
        </Button>
        <Button
          size='small'
          variant='contained'
          onClick={handleSubmit}
        >
          {t("edit")}
        </Button>
      </Row>
    </Box>
  );
}
