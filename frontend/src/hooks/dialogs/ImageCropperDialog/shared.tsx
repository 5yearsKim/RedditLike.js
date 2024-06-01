"use client";

import React, { useState, ReactNode } from "react";
import { Dialog } from "@mui/material";
import { ImageCropper } from "@/ui/tools/ImageCropper";
import { BoardThemeProvider } from "@/ui/tools/BoardThemeProvider";
import { useRecoilState } from "recoil";
import { useBoardMain$ } from "@/stores/BoardMainStore";
import { imageCropperState } from "./state";
import { getFileFromUrl } from "./utils";

export function ImageCropperDialogShared(): ReactNode {
  const [imageCropper, setImageCropper] = useRecoilState(imageCropperState);
  const {
    src,
    isOpen,
    cropShape,
    aspect,
    onCropped,
    onDismiss,
  } = imageCropper;

  const boardMain$ = useBoardMain$();
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const submitDisable = isUploading;

  function handleClose(): void {
    setImageCropper({
      src: "",
      isOpen: false,
      onCropped: undefined,
      onDismiss: undefined,
    });
    onDismiss && onDismiss();
  }

  async function handleApplyClick(edited: string): Promise<void> {
    if (!onCropped) {
      return;
    }
    try {
      setIsUploading(true);
      const imgFile = await getFileFromUrl(edited);
      onCropped({ imgFile });
      setIsUploading(false);
      handleClose();
    } catch (e) {
      console.warn(e);
      setIsUploading(false);
    }
  }
  return (
    <BoardThemeProvider board={boardMain$.data?.board ?? null}>
      <Dialog
        open={isOpen}
        onClose={handleClose}
        maxWidth='sm'
        fullWidth
        sx={{
          backdropFilter: "blur(10px)",
        }}
      >
        <ImageCropper
          image={src!}
          cropShape={cropShape}
          // cropShape="rect"
          aspect={aspect}
          submitDisabled={submitDisable}
          onApply={handleApplyClick}
          onCancel={handleClose}
        />
      </Dialog>
    </BoardThemeProvider>
  );
}
