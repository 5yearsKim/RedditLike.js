"use client";
import React, { Fragment, ReactNode } from "react";
import { useTranslations } from "next-intl";
import {
  IconButton, Menu, MenuItem, ListItemIcon, ListItemText, Divider, useTheme,
} from "@mui/material";
import { MoreHorizIcon, BlockIcon, UnblockIcon, StarOlIcon, DeleteOlIcon, RetryIcon, CloseIcon } from "@/ui/icons";
import { Box } from "@/ui/layouts";
import { Txt } from "@/ui/texts";

// logic
import { useState, MouseEvent } from "react";
import { useAlertDialog, useLoginAlertDialog } from "@/hooks/dialogs/ConfirmDialog";
import { useSnackbar } from "@/hooks/Snackbar";
import type { BoardT } from "@/types/Board";
import { useMe, useMeAdmin } from "@/stores/UserStore";
import * as BoardApi from "@/apis/boards";
import * as BoardFollowerApi from "@/apis/board_followers";
import * as BoardBlockApi from "@/apis/board_blocks";

type BoardMenuButtonProps = {
  board: BoardT;
  color?: "contrast";
  size?: "medium" | "small";
  onUpdated: (board: BoardT) => void;
};

export function BoardMenuButton({
  board,
  color,
  size,
  onUpdated,
}: BoardMenuButtonProps): ReactNode {
  const t = useTranslations("components.BoardMenuButton");
  const theme = useTheme();
  const me = useMe();
  const admin = useMeAdmin();
  const { showAlertDialog } = useAlertDialog();
  const { showLoginAlertDialog } = useLoginAlertDialog();
  const { enqueueSnackbar } = useSnackbar();

  const [menuEl, setMenuEl] = useState<HTMLElement | null>(null);
  const isMenuOpen = Boolean(menuEl);

  function handleButtonClick(e: MouseEvent<HTMLButtonElement>): void {
    e.preventDefault();
    e.stopPropagation();
    setMenuEl(e.currentTarget);
  }

  function handleEmptyMenuClick(e: MouseEvent<HTMLElement>): void {
    // this function for preventing propagation
    e.preventDefault();
    e.stopPropagation();
  }

  function handleMenuClose(e: MouseEvent<HTMLElement>): void {
    e.preventDefault();
    e.stopPropagation();
    setMenuEl(null);
  }

  async function handleFollowClick(e: MouseEvent<HTMLElement>): Promise<void> {
    e.preventDefault();
    setMenuEl(null);

    if (!me) {
      await showLoginAlertDialog();
      return;
    }

    try {
      const follower = await BoardFollowerApi.follow(board.id);
      onUpdated({ ...board, follower });
      enqueueSnackbar(t("subscribeSuccess"), { variant: "success" });
    } catch (e) {
      console.warn(e);
      enqueueSnackbar(t("subscribeFailed"), { variant: "error" });
    }
  }

  async function handleUnfollowClick(e: MouseEvent<HTMLElement>): Promise<void> {
    e.preventDefault();
    setMenuEl(null);

    if (!me) {
      await showLoginAlertDialog();
      return;
    }

    try {
      await BoardFollowerApi.unfollow(board.id);
      onUpdated({ ...board, follower: undefined });
      enqueueSnackbar(t("unsubscribeSuccess"), { variant: "info" });
    } catch (e) {
      console.warn(e);
      enqueueSnackbar(t("unsubscribeFailed"), { variant: "error" });
    }
  }

  async function handleBlockClick(e: MouseEvent<HTMLElement>): Promise<void> {
    e.preventDefault();
    e.stopPropagation();
    setMenuEl(null);
    if (board.block) {
      return; // throw error
    }
    if (!me) {
      await showLoginAlertDialog();
      return;
    }
    const isOk = await showAlertDialog({
      title: t("boardBlock", { boardName: board.name }),
      body: t("boardBlockMsg"),
      useOk: true,
      useCancel: true,
    });
    if (!isOk) {
      return;
    }
    try {
      const block = await BoardBlockApi.create({ board_id: board.id, user_id: me.id });
      onUpdated({
        ...board,
        block: block,
      });
      enqueueSnackbar(t("boardBlockSuccess"), { variant: "success" });
    } catch (e) {
      enqueueSnackbar(t("boardBlockFailed"), { variant: "error" });
    }
  }

  async function handleUnblockClick(e: MouseEvent<HTMLElement>): Promise<void> {
    e.preventDefault();
    e.stopPropagation();
    setMenuEl(null);
    if (!board.block) {
      return; // throw error
    }
    const isOk = await showAlertDialog({
      title: t("unblockBoard", { boardName: board.name }),
      body: t("unblockBoardMsg"),
      useOk: true,
      useCancel: true,
    });
    if (!isOk) {
      return;
    }
    try {
      await BoardBlockApi.remove(board.block.id);
      onUpdated({
        ...board,
        block: undefined,
      });
      enqueueSnackbar(t("unblockBoardSuccess"), { variant: "success" });
    } catch (e) {
      enqueueSnackbar(t("unblockBoardFailed"), { variant: "error" });
    }
  }

  async function handleAdminTrashClick(e: MouseEvent<HTMLElement>): Promise<void> {
    e.preventDefault();
    setMenuEl(null);
    const isOk = await showAlertDialog({
      title: t("trashBoard"),
      body: t("trashBoardMsg"),
      useOk: true,
      useCancel: true,
    });
    if (!isOk) {
      return;
    }
    try {
      const updated = await BoardApi.adminTrash(board.id);
      onUpdated({ ...board, ...updated });
      enqueueSnackbar(t("trashBoardSuccess"), { variant: "success" });
    } catch (e) {
      console.warn(e);
      enqueueSnackbar(t("trashBoardFailed"), { variant: "error" });
    }

  }

  async function handleAdminRestoreClick(e: MouseEvent<HTMLElement>): Promise<void> {
    e.preventDefault();
    setMenuEl(null);
    const isOk = await showAlertDialog({
      title: t("restoreBoard"),
      body: t("restoreBoardMsg"),
      useOk: true,
      useCancel: true,
    });
    if (!isOk) {
      return;
    }
    try {
      const updated = await BoardApi.adminRestore(board.id);
      onUpdated({ ...board, ...updated });
      enqueueSnackbar(t("restoreBoardMsg"), { variant: "success" });
    } catch (e) {
      console.warn(e);
      enqueueSnackbar(t("restoreBoardFailed"), { variant: "error" });
    }
  }


  return (
    <Fragment>
      <IconButton
        aria-label='board-menu-button'
        onClick={handleButtonClick}
      >
        <MoreHorizIcon
          fontSize={size}
          sx={{
            color: color === "contrast" ? theme.palette.primary.contrastText : undefined,
          }}
        />
      </IconButton>
      <Menu
        anchorEl={menuEl}
        open={isMenuOpen}
        onClose={handleMenuClose}
        onClick={handleEmptyMenuClick}
      >
        {board.follower ? (
          <MenuItem onClick={handleUnfollowClick}>
            <ListItemIcon>
              <CloseIcon />
            </ListItemIcon>
            <ListItemText>{t("unsubscirbe")}</ListItemText>
          </MenuItem>
        ) : (
          <MenuItem onClick={handleFollowClick}>
            <ListItemIcon>
              <StarOlIcon />
            </ListItemIcon>
            <ListItemText>{t("subscribe")}</ListItemText>
          </MenuItem>
        )}
        {board.block ? (
          <MenuItem onClick={handleUnblockClick}>
            <ListItemIcon>
              <UnblockIcon />
            </ListItemIcon>
            <ListItemText>{t("unblock")}</ListItemText>
          </MenuItem>
        ) : (
          <MenuItem onClick={handleBlockClick}>
            <ListItemIcon>
              <BlockIcon />
            </ListItemIcon>
            <ListItemText>{t("block")}</ListItemText>
          </MenuItem>
        )}
        {admin && [
          <Divider key='admin-divider'/>,
          <Box key='admin-title' mx={2} mb={1}>
            <Txt variant="body3" fontWeight={700}>{t("adminFeature")}</Txt>
          </Box>,
          board.trashed_at ? (
            <MenuItem key='restore-board' onClick={handleAdminRestoreClick}>
              <ListItemIcon>
                <RetryIcon/>
              </ListItemIcon>
              <ListItemText>{t("restoreBoard")}</ListItemText>
            </MenuItem>
          ) : (
            <MenuItem key='trash-board' onClick={handleAdminTrashClick}>
              <ListItemIcon>
                <DeleteOlIcon/>
              </ListItemIcon>
              <ListItemText>{t("trashBoard")}</ListItemText>
            </MenuItem>
          ),
        ]}
      </Menu>
    </Fragment>
  );
}
