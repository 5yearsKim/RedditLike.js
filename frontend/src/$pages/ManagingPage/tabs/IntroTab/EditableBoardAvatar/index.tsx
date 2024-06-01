"use client";

import React, { Fragment } from "react";
import { useTranslations } from "next-intl";
import { Box, Badge, Fab, Menu, MenuItem, ListItemIcon } from "@mui/material";
import { EditIcon, CameraIcon, ImageOlIcon, AccountIcon } from "@/ui/icons";
import { BoardAvatar } from "@/ui/tools/Avatar";
// logic
import { useRef, useState, ChangeEvent, MouseEvent } from "react";
import { useImageCropper } from "@/hooks/dialogs/ImageCropperDialog";
import { useSnackbar } from "notistack";
import * as BoardApi from "@/apis/boards";
import { uploadToS3 } from "@/utils/media";
import type { BoardT } from "@/types";

type EditableBoardAvatarProps = {
  board: BoardT;
  onUpdated: (avatarPath: string | null) => any;
};

export function EditableBoardAvatar({
  board,
  onUpdated,
}: EditableBoardAvatarProps): JSX.Element {
  const t = useTranslations("pages.ManagingPage.IntroTab.EditableBoardAvatar");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { showImageCropper } = useImageCropper();
  const { enqueueSnackbar } = useSnackbar();
  const [menuEl, setMenuEl] = useState<HTMLElement | null>(null);
  const menuOpen = Boolean(menuEl);

  function handleButtonClick(e: MouseEvent<HTMLButtonElement>): void {
    e.preventDefault();
    e.stopPropagation();
    if (board.avatar_path) {
      setMenuEl(e.currentTarget);
    } else {
      handleFileUploadTrigger();
    }
  }

  function handleMenuClose(): void {
    setMenuEl(null);
  }

  function handleFileUploadTrigger(): void {
    if (!inputRef) {
      return;
    }
    if (menuEl) {
      setMenuEl(null);
    }
    inputRef.current!.click();
  }

  function handleImageRemove(): void {
    if (!board.avatar_path) {
      return;
    }
    onUpdated(null);
    setMenuEl(null);
  }

  async function handleInputFileChange(e: ChangeEvent<HTMLInputElement>): Promise<void> {
    const files = e.target.files;
    if (!files || !files.length) {
      return;
    }
    const file = files[0];
    const imgUrl = URL.createObjectURL(file);
    const cropped = await showImageCropper({
      src: imgUrl,
      aspect: 1,
      cropShape: "round",
    });
    if (!cropped) {
      return;
    }
    try {
      const { putUrl, key } = await BoardApi.getAvatarPresignedUrl(board.id, cropped.imgFile.type);
      await uploadToS3(putUrl, cropped.imgFile);
      onUpdated(key);
    } catch (e) {
      enqueueSnackbar(t("imageUploadFailed"), { variant: "error" });
    }
  }


  return (
    <Fragment>
      <input
        ref={inputRef}
        hidden
        accept='image/*'
        multiple={false}
        type='file'
        onChange={handleInputFileChange}
        onClick={(e: any): void => {
          e.target.value = null;
        }}
      />
      <Box
        width='auto'
        height='auto'
        borderRadius='50%'
        p='3px'
        bgcolor='paper.main'
        sx={{
          transform: "scale(1.5)",
        }}
      >
        <Badge
          overlap='circular'
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          badgeContent={
            <Fab
              onClick={handleButtonClick}
              size='small'
              sx={{ transform: "scale(0.5)" }}
            >
              {board.avatar_path ? <EditIcon /> : <CameraIcon />}
            </Fab>
          }
        >
          <BoardAvatar board={board} size='40px'/>
        </Badge>
      </Box>
      <Menu
        anchorEl={menuEl}
        open={menuOpen}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleFileUploadTrigger}>
          <ListItemIcon>
            <ImageOlIcon />
          </ListItemIcon>
          {t("changeProfile")}
        </MenuItem>
        <MenuItem onClick={handleImageRemove}>
          <ListItemIcon>
            <AccountIcon />
          </ListItemIcon>
          {t("defaultAvatar")}
        </MenuItem>
      </Menu>
    </Fragment>
  );
}
