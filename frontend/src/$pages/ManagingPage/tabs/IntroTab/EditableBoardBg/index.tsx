"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useResponsive } from "@/hooks/Responsive";
import { EditIcon, DeleteIcon } from "@/ui/icons";
import { Row, Box } from "@/ui/layouts";
import { CircleIconButton } from "@/ui/tools/CircleIconButton";

import { Tooltip } from "@/ui/tools/Tooltip";

import { useRef, ChangeEvent } from "react";
import { useAlertDialog } from "@/hooks/dialogs/ConfirmDialog";
import { useImageCropper } from "@/hooks/dialogs/ImageCropperDialog";
import { useSnackbar } from "@/hooks/Snackbar";
import { buildImgUrl, uploadToS3 } from "@/utils/media";
import * as BoardApi from "@/apis/boards";
import type { BoardT } from "@/types";

type EditableBoardBgProps = {
  board: BoardT
  onUpdated: (bgPath: string | null) => any;
};

export function EditableBoardBg({
  board,
  onUpdated,
}: EditableBoardBgProps): JSX.Element {
  const t = useTranslations("pages.ManagingPage.IntroTab.EditableBoardBg");

  const inputRef = useRef<HTMLInputElement | null>(null);
  const { showAlertDialog } = useAlertDialog();
  const { showImageCropper } = useImageCropper();
  const { enqueueSnackbar } = useSnackbar();

  async function handleFileInputChange(e: ChangeEvent<HTMLInputElement>): Promise<void> {
    const files = e.target.files;
    if (!files || !files.length) {
      return;
    }
    const file = files[0];
    const fileUrl = URL.createObjectURL(file);
    try {
      const cropped = await showImageCropper({
        src: fileUrl,
        cropShape: "rect",
        aspect: 4,
      });
      if (!cropped) {
        return;
      }
      const { putUrl, key } = await BoardApi.getBgCoverPresignedUrl(board.id, cropped.imgFile.type);
      await uploadToS3(putUrl, cropped.imgFile);
      onUpdated(key);
    } catch (e) {
      console.warn(e);
      enqueueSnackbar(t("imageUploadFailed"), { variant: "error" });
    }
  }

  function handleEditClick(): void {
    if (!inputRef) {
      return;
    }
    inputRef.current!.click();
  }

  async function handleDeleteClick(): Promise<void> {
    const isOk = await showAlertDialog({
      title: t("deleteBg"),
      body: t("deleteBgMsg"),
      useOk: true,
      useCancel: true,
    });
    if (!isOk) {
      return;
    }
    onUpdated(null);
  }

  const { downSm } = useResponsive();


  return (
    <Box
      position='relative'
      width='100%'
      bgcolor={(theme) => {
        if (board.use_theme && board.theme_color) {
          return board.theme_color;
        } else {
          return theme.palette.primary.light;
        }
      }}
      height={board.bg_path ? "calc(50px + 8vh)" : "50px"}
      overflow='hidden'
    >
      <input
        ref={inputRef}
        hidden
        accept='image/*'
        multiple={false}
        type='file'
        onChange={handleFileInputChange}
        onClick={(e: any): void => {
          e.target.value = null;
        }}
      />
      {board.bg_path && (
        <img
          src={buildImgUrl(null, board.bg_path, { size: "xs" })}
          alt='bg-img'
          width='100%'
          height='100%'
          style={{ objectFit: "cover" }}
        />
      )}
      <Row
        position='absolute'
        right='8px'
        bottom='4px'
      >
        <Tooltip title={t("editBg")}>
          <CircleIconButton
            onClick={handleEditClick}
            size={downSm ? "small" : "medium"}
          >
            <EditIcon fontSize='small' />
          </CircleIconButton>
        </Tooltip>
        {board.bg_path && (
          <>
            <Box mr={0.5} />
            <Tooltip title={t("deleteBg")}>
              <CircleIconButton
                onClick={handleDeleteClick}
                size={downSm ? "small" : "medium"}
              >
                <DeleteIcon fontSize='small' />
              </CircleIconButton>
            </Tooltip>
          </>
        )}
      </Row>
    </Box>
  );
}
