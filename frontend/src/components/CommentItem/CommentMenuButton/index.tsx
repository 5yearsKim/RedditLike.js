"use client";

import React, { useState, MouseEvent, Fragment, ReactNode } from "react";
import { useTranslations } from "next-intl";
import { useResponsive } from "@/hooks/Responsive";
import { IconButton, Menu, MenuItem, ListItemIcon, Divider } from "@mui/material";
import { Box } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { MoreHorizIcon, DeleteOlIcon, EditOlIcon, ReportIcon } from "@/ui/icons";
// logic
import { useReportDialog } from "@/hooks/dialogs/ReportDialog";
import { useAlertDialog, useLoginAlertDialog } from "@/hooks/dialogs/ConfirmDialog";
import { useSnackbar } from "@/hooks/Snackbar";
import { useMe, useMeAdmin } from "@/stores/UserStore";
import { DeleteReasonDialog } from "@/components/ManagingSection/DeleteReasonDialog";
import * as CommentApi from "@/apis/comments";
import type { PostT, CommentT, BoardManagerT } from "@/types";

type CommentMenuButtonProps = {
  post: PostT | null;
  comment: CommentT;
  manager: BoardManagerT | null;
  isEditingMode?: boolean;
  onUpdated: (comment: CommentT) => void;
  onEditClick: () => void;
};

export function CommentMenuButton({
  post,
  comment,
  manager,
  isEditingMode,
  onUpdated,
  onEditClick,
}: CommentMenuButtonProps): ReactNode {
  const t = useTranslations("components.CommentItem.CommentMenuButton");

  const { showReportDialog } = useReportDialog("comment");
  const { showAlertDialog } = useAlertDialog();
  const { showLoginAlertDialog } = useLoginAlertDialog();
  const { enqueueSnackbar } = useSnackbar();

  const me = useMe();
  const admin = useMeAdmin();
  const [menuEl, setMenuEl] = useState<HTMLElement | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const isMenuOpen = Boolean(menuEl);

  function handleButtonClick(e: MouseEvent<HTMLButtonElement>): void {
    e.preventDefault();
    e.stopPropagation();
    setMenuEl(e.currentTarget);
  }

  function handleEmptyMenuClick(e: MouseEvent<HTMLElement>): void {
    e.preventDefault();
    e.stopPropagation();
  }

  function handleMenuClose(e: MouseEvent<HTMLElement>): void {
    e.preventDefault();
    e.stopPropagation();
    setMenuEl(null);
  }

  function handleReportClick(e: MouseEvent<HTMLElement>): void {
    e.preventDefault();
    e.stopPropagation();
    if (!me) {
      showLoginAlertDialog();
      return;
    }
    showReportDialog(comment.id);
    setMenuEl(null);
  }

  async function handleEditClick(e: MouseEvent<HTMLElement>): Promise<void> {
    e.preventDefault();
    e.stopPropagation();

    onEditClick();
    setMenuEl(null);
  }

  async function handleDeleteClick(e: MouseEvent<HTMLElement>): Promise<void> {
    e.preventDefault();
    e.stopPropagation();
    try {
      const isOk = await showAlertDialog({
        title: t("deleteComment"),
        body: t("deleteCommentMsg"),
        useCancel: true,
        useOk: true,
      });
      if (isOk !== true) {
        return;
      }
      await CommentApi.remove(comment.id);
      enqueueSnackbar(t("deleteCommentSuccess"), { variant: "success" });
      onUpdated({ ...comment, body: "", deleted_at: new Date() });
    } catch (e) {
      enqueueSnackbar(t("deleteCommentFailed"), { variant: "error" });
      console.warn(e);
    }
    setMenuEl(null);
  }
  function handleAdminTrashClick(e: MouseEvent<HTMLElement>): void {
    e.preventDefault();
    setMenuEl(null);
    setIsDeleteDialogOpen(true);
  }

  async function handleTrashReasonSubmit(reason: string): Promise<void> {
    try {
      const { comment: trashed } = await CommentApi.adminTrash(comment.id, reason);
      onUpdated({ ...comment, ...trashed });
      setIsDeleteDialogOpen(false);
      enqueueSnackbar(t("trashCommentSuccess"), { variant: "success" });
    } catch (e) {
      console.warn(e);
      enqueueSnackbar(t("trashCommentFailed"), { variant: "error" });
    }
  }


  const { downSm } = useResponsive();

  const menuDense = downSm;

  return (
    <Fragment>
      <IconButton
        aria-label='comment-menu-button'
        onClick={handleButtonClick}
      >
        <MoreHorizIcon fontSize={downSm ? "small" : "medium"} />
      </IconButton>
      <Menu
        anchorEl={menuEl}
        open={isMenuOpen}
        onClose={handleMenuClose}
        onClick={handleEmptyMenuClick}
      >
        <MenuItem
          onClick={handleReportClick}
          dense={menuDense}
        >
          <ListItemIcon>
            <ReportIcon />
          </ListItemIcon>
          {t("report")}
        </MenuItem>
        {me && comment.author?.id == me?.id && !comment.deleted_at && (
          <MenuItem
            onClick={handleEditClick}
            dense={menuDense}
            disabled={isEditingMode || Boolean(comment.num_children)}
          >
            <ListItemIcon>
              <EditOlIcon />
            </ListItemIcon>
            {t("edit")}
          </MenuItem>
        )}
        {me && comment.author?.id == me?.id && !comment.deleted_at && (
          <MenuItem
            onClick={handleDeleteClick}
            dense={menuDense}
          >
            <ListItemIcon>
              <DeleteOlIcon />
            </ListItemIcon>
            {t("delete")}
          </MenuItem>
        )}
        {manager && [
          <Divider key='divider' />,
        ]}

        {admin && [
          <Divider key='admin-divider'/>,
          <Box key='admin-title' mx={2} mb={1}>
            <Txt variant="body3" fontWeight={700}>{t("adminFeature")}</Txt>
          </Box>,
          <MenuItem
            key='admin-trash'
            onClick={handleAdminTrashClick}
            dense={menuDense}
            disabled={admin.manage_censor !== true}
          >
            <ListItemIcon>
              <DeleteOlIcon/>
            </ListItemIcon>
            {t("trash")}
          </MenuItem>,
        ]}
      </Menu>
      {admin && (
        <DeleteReasonDialog
          open={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onSubmit={handleTrashReasonSubmit}
        />
      )}
    </Fragment>
  );
}
