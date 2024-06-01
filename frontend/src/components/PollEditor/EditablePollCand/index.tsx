"use client";

import React, { useRef, ChangeEvent } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { IconButton, InputBase, Paper } from "@mui/material";
import { PhotoAddIcon, CloseIcon } from "@/ui/icons";
import { Row } from "@/ui/layouts";
import { Tooltip } from "@/ui/tools/Tooltip";
import { Clickable } from "@/ui/tools/Clickable";
import { useAlertDialog } from "@/hooks/dialogs/ConfirmDialog";
import { useImageCropper } from "@/hooks/dialogs/ImageCropperDialog";
import { useSnackbar } from "@/hooks/Snackbar";
import * as PollCandApi from "@/apis/poll_cands";
import { uploadToS3, buildImgUrl } from "@/utils/media";
import type { PollCandFormT } from "@/types";


type EditablePollCandProps = {
  cand: PollCandFormT
  onChange: (cand: PollCandFormT) => void
  onDelete: () => void
}

export function EditablePollCand({
  cand,
  onChange,
  onDelete,
}: EditablePollCandProps): JSX.Element {
  const t = useTranslations("components.PollEditor.EditablePollCand");

  const thumbnailInputRef = useRef<HTMLInputElement | null>(null);

  const { showAlertDialog } = useAlertDialog();
  const { showImageCropper } = useImageCropper();
  const { enqueueSnackbar } = useSnackbar();

  function handleLabelChange(e: ChangeEvent<HTMLInputElement>): void {
    const val = e.target.value;
    onChange({ ...cand, label: val });
  }


  async function handleDeleteClick(): Promise<void> {
    const isOk = await showAlertDialog({
      title: t("deleteCand"),
      body: t("deleteCandMsg"),
      useCancel: true,
      useOk: true,
    });
    if (!isOk) {
      return;
    }
    onDelete();
  }

  function handleAddThumbnailClick(): void {
    if (!thumbnailInputRef) {
      return;
    }
    thumbnailInputRef.current!.click();
  }

  async function handleThumbnailInpuChange(e: ChangeEvent<HTMLInputElement>): Promise<void> {
    const files = e.target.files;
    if (!files || !files.length) {
      return;
    }
    const file = files[0];
    const imgUrl = URL.createObjectURL(file);
    const cropped = await showImageCropper({
      src: imgUrl,
      aspect: 1,
      cropShape: "rect",
    });
    if (!cropped) {
      return;
    }
    try {
      const thumbFile = cropped.imgFile;
      const { key, putUrl } = await PollCandApi.getThumbnailPresignedUrl(thumbFile.type);
      await uploadToS3(putUrl, thumbFile);
      onChange({ ...cand, thumb_path: key });
    } catch (e) {
      console.warn(e);
      enqueueSnackbar(t("imgUploadFailed"), { variant: "error" });
    }
  }

  async function handleThumbnailImageRemove(): Promise<void> {
    const isOk = await showAlertDialog({
      title: t("initializeImage"),
      body: t("initializeImageMsg"),
      useCancel: true,
      useOk: true,
    });
    if (!isOk) {
      return;
    }
    onChange({ ...cand, thumb_path: null });
  }

  return (
    <Paper>
      <Row width='100%' minHeight={40}>
        <InputBase
          value={cand.label}
          fullWidth
          placeholder={t("typeCand")}
          onChange={handleLabelChange}
          sx={{ px: 2 }}
        />
        <input
          ref={thumbnailInputRef}
          hidden
          accept='image/*'
          multiple={false}
          type='file'
          onChange={handleThumbnailInpuChange}
          onClick={(e: any): void => {
            e.target.value = null;
          }}
        />
        {cand.thumb_path ? (
          <Clickable onClick={handleThumbnailImageRemove}>
            <Image
              src={buildImgUrl(null, cand.thumb_path, { size: "xs" })}
              alt={cand.thumb_path}
              width={60}
              height={60}
              style={{ margin: "4px" }}
            />
          </Clickable>
        ) : (
          <Tooltip title={t("addImage")}>
            <IconButton
              size='small'
              onClick={handleAddThumbnailClick}
            >
              <PhotoAddIcon/>
            </IconButton>
          </Tooltip>
        )}
        <Tooltip title={t("delete")}>
          <IconButton
            size='small'
            onClick={handleDeleteClick}
          >
            <CloseIcon/>
          </IconButton>
        </Tooltip>
      </Row>
    </Paper>
  );
}