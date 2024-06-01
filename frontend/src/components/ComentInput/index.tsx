"use client";
import React, { useState, useMemo, ChangeEvent, useRef, ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Button, CircularProgress, Box, Checkbox, IconButton } from "@mui/material";
import { RichEditor2, CommentDisableFeatures } from "@/components/RichEditor2";
import { useTheme } from "@mui/material/styles";
import { Row, Expand } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { ImageOlIcon } from "@/ui/icons";
// logic
import { RichEditor2T } from "@/components/RichEditor2";
import { useBoardMain$ } from "@/stores/BoardMainStore";
import * as CommentApi from "@/apis/comments";
import { extractText, trimHtml } from "@/utils/html";
import type { CommentFormT, CommentT, UserT } from "@/types";


type CommentInputProps = {
  postId: idT;
  me: UserT
  parent?: CommentT;
  onSubmitted?: (comment: CommentT) => void;
  onCancel?: () => void;
};

export function CommentInput({
  postId,
  me,
  parent,
  onSubmitted,
  onCancel,
}: CommentInputProps): ReactNode {
  const t = useTranslations("components.CommentInput");

  const richEditorRef = useRef<RichEditor2T | null>(null);
  const boardMain$ = useBoardMain$();
  const [isFocus, setIsFocus] = useState<boolean>(false);
  const [showManager, setShowManager] = useState<boolean>(false);
  const [body, setBody] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const theme = useTheme();
  const showCancel = Boolean(onCancel);

  const isEmpty = useMemo(() => {
    if (body.length > 15) {
      return false;
    }
    const text = extractText(body, "html");
    const stripped = text.trim();
    return stripped.length == 0;
  }, [body]);

  const submitDisable = isSubmitting || isEmpty;

  function handleBodyChange(val: string): void {
    setBody(val);
  }

  function handleFocus(): void {
    setIsFocus(true);
  }
  function handleBlur(): void {
    setIsFocus(false);
  }

  async function handleSubmit(): Promise<void> {
    try {
      setIsSubmitting(true);
      const form: CommentFormT = {
        author_id: me.id,
        post_id: postId,
        body: trimHtml(body),
        path: parent ? (parent.path ? `${parent.path}.${parent.id}` : parent.id.toString()) : undefined,
        parent_id: parent?.id,
        body_type: "html",
        show_manager: showManager,
      };
      const created = await CommentApi.create(form);
      // await new Promise(r => setTimeout(r, 1000));

      const { data: newComment } = await CommentApi.get(created.id, {
        $defaults: true,
        $author_idx: true,
      });

      setBody("");
      if (onSubmitted) {
        onSubmitted(newComment);
      }
    } catch (e) {
      console.warn(e);
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleImageClick(): void {
    richEditorRef.current?.showImageDialog();
  }

  function handleShowManagerChange(e: ChangeEvent<HTMLInputElement>): void {
    const checked = e.target.checked;
    setShowManager(checked);
  }

  function handleCancel(): void {
    if (onCancel) {
      onCancel();
    }
  }


  return (
    <Box
      // bgcolor='green'
      border='solid 1px'
      borderColor={isFocus ? theme.palette.primary.main : "#dddddd"}
    >
      <RichEditor2
        ref={richEditorRef}
        value={body}
        placeholder={t("typeComment")}
        disableFeatures={CommentDisableFeatures}
        className='comment-editor-specific'
        onChange={handleBodyChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />

      <Row>
        <IconButton
          size='small'
          onClick={handleImageClick}
        >
          <ImageOlIcon sx={{ fontSize: 22, color: "vague.light" }} />
        </IconButton>
        <Expand />
        {boardMain$.data?.author?.is_manager && (
          <>
            <Txt variant='body3'>{t("boardManager")}</Txt>
            <Checkbox
              value={showManager}
              onChange={handleShowManagerChange}
              size='small'
            />
          </>
        )}
        {showCancel && <Button onClick={handleCancel}>{t("cancel")}</Button>}
        <Button
          onClick={handleSubmit}
          disabled={submitDisable}
          // size='small'
        >
          {isSubmitting ? <CircularProgress size='1.5rem' /> : t("submit")}
        </Button>
      </Row>
    </Box>
  );
}
