"use client";
import React, { forwardRef } from "react";
import { useTranslations } from "next-intl";
import { useResponsive } from "@/hooks/Responsive";
import { IconButton, Menu, MenuItem, ListItemIcon, Divider } from "@mui/material";
import {
  MoreHorizIcon, ReportIcon, BookmarkOlIcon, UnbookmarkOlIcon,
  PinIcon, UnpinIcon, BlockIcon, ShareIcon, DeleteOlIcon,
} from "@/ui/icons";
import { Txt } from "@/ui/texts";
import { Box } from "@/ui/layouts";
import { PostShareDialog } from "./PostShareDialog";
// logic
import { useState, MouseEvent, useImperativeHandle } from "react";
import { useReportDialog } from "@/hooks/dialogs/ReportDialog";
import { useLoginAlertDialog, useAlertDialog } from "@/hooks/dialogs/ConfirmDialog";
import { useBlockAuthorDialog } from "@/hooks/dialogs/BlockAuthorDialog";
import { useSnackbar } from "@/hooks/Snackbar";
import { useMe } from "@/stores/UserStore";
// import { PostPinS, PostS, PostBookmarkS } from "@";
import * as PostApi from "@/apis/posts";
import * as PostBookmarkApi from "@/apis/post_bookmarks";
import * as PostPinApi from "@/apis/post_pins";
import { useMeAdmin } from "@/stores/UserStore";
import { DeleteReasonDialog } from "@/components/ManagingSection/DeleteReasonDialog";
import type { PostT, BoardManagerT } from "@/types";


export type PostMenuButtonT = {
  clickReport: (e: MouseEvent<HTMLButtonElement>) => void;
  clickBookmark: (e: MouseEvent<HTMLButtonElement>) => void;
  clickShare: (e: MouseEvent<HTMLButtonElement>) => void;
};

type PostMenuButtonProps = {
  post: PostT;
  manager: BoardManagerT | null;
  onUpdated: (post: PostT) => void;
};


export const PostMenuButton = forwardRef<PostMenuButtonT, PostMenuButtonProps>(
  (props: PostMenuButtonProps, ref): JSX.Element => {
    const { post, manager, onUpdated } = props;

    const t = useTranslations("components.PostMenuButton");

    const { showReportDialog } = useReportDialog("post");
    const { openBlockAuthorDialog } = useBlockAuthorDialog();
    const { showLoginAlertDialog } = useLoginAlertDialog();
    const { showAlertDialog } = useAlertDialog();
    const { enqueueSnackbar } = useSnackbar();

    const me = useMe();
    const admin = useMeAdmin();

    const [isShareDialogOpen, setIsShareDialogOpen] = useState<boolean>(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
    const [menuEl, setMenuEl] = useState<HTMLElement | null>(null);
    const isMenuOpen = Boolean(menuEl);

    useImperativeHandle(ref, () => ({
      clickReport(e): void {
        handleReportClick(e);
      },
      clickBookmark(e): void {
        if (post.bookmark) {
          handleUnbookmarkClick(e);
        } else {
          handleBookmarkClick(e);
        }
      },
      clickShare(e): void {
        handleShareClick(e);
      },
    }));

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

    function handleShareClick(e: MouseEvent<HTMLElement>): void {
      e.preventDefault();
      e.stopPropagation();
      setMenuEl(null);
      setIsShareDialogOpen(true);
    }

    function handleShareDialogClose(): void {
      setIsShareDialogOpen(false);
    }

    function handleReportClick(e: MouseEvent<HTMLElement>): void {
      e.preventDefault();
      e.stopPropagation();
      setMenuEl(null);
      if (me) {
        showReportDialog(post.id);
      } else {
        showLoginAlertDialog();
      }
    }

    // only available to manager
    async function handlePinClick(e: MouseEvent<HTMLElement>): Promise<void> {
      e.preventDefault();
      if (post.deleted_at) {
        await showAlertDialog({
          body: t("cannotPinDeleted"),
          useOk: true,
        });
        return;
      }
      try {
        await PostPinApi.create({
          post_id: post.id,
          board_id: post.board_id,
        });
        const { data: updated } = await PostApi.get(post.id, { $defaults: true });
        onUpdated(updated);
        enqueueSnackbar(t("pinSuccess"), { variant: "success" });
        setMenuEl(null);
      } catch (e) {
        console.warn(e);
        enqueueSnackbar(t("pinFailed"), { variant: "error" });
      }
    }

    // only available to manager
    async function handleUnpinClick(e: MouseEvent<HTMLElement>): Promise<void> {
      e.preventDefault();
      if (!post.pin?.id) {
        setMenuEl(null);
        return;
      }
      try {
        await PostPinApi.remove(post.board_id, post.id);
        const { data: updated } = await PostApi.get(post.id, { $defaults: true });
        onUpdated(updated);
        enqueueSnackbar(t("unpinSuccess"), { variant: "success" });
        setMenuEl(null);
      } catch (e) {
        console.warn(e);
        enqueueSnackbar(t("unpinFailed"), { variant: "error" });
      }
    }

    async function handleAuthorBlockClick(e: MouseEvent<HTMLElement>): Promise<void> {
      e.preventDefault();
      if (post.author) {
        openBlockAuthorDialog("board", post.author);
        setMenuEl(null);
      }
    }

    async function handleBookmarkClick(e: MouseEvent<HTMLElement>): Promise<void> {
      e.preventDefault();
      if (!me) {
        await showLoginAlertDialog();
        return;
      }
      try {
        const created = await PostBookmarkApi.create({
          user_id: me.id,
          post_id: post.id,
        });
        onUpdated({
          ...post,
          bookmark: created,
        });
        enqueueSnackbar(t("bookmarkSuccess"), { variant: "success" });
        setMenuEl(null);
      } catch (e) {
        console.warn(e);
        enqueueSnackbar(t("bookmarkFailed"), { variant: "error" });
      }
    }

    async function handleUnbookmarkClick(e: MouseEvent<HTMLElement>): Promise<void> {
      e.preventDefault();
      if (!me) {
        await showLoginAlertDialog();
        return;
      }
      if (!post.bookmark) {
        return;
      }
      try {
        await PostBookmarkApi.remove(post.bookmark.id);
        onUpdated({
          ...post,
          bookmark: undefined,
        });
        enqueueSnackbar(t("unbookmarkSuccess"), { variant: "info" });
        setMenuEl(null);
      } catch (e) {
        console.warn(e);
        enqueueSnackbar(t("unbookmarkFailed"), { variant: "error" });
      }
    }

    function handleAdminTrashClick(e: MouseEvent<HTMLElement>): void {
      e.preventDefault();
      setMenuEl(null);
      setIsDeleteDialogOpen(true);
    }

    async function handleTrashReasonSubmit(reason: string): Promise<void> {
      try {
        const { post: trashed } = await PostApi.adminTrash(post.id, reason);
        onUpdated({ ...post, ...trashed });
        setIsDeleteDialogOpen(false);
        enqueueSnackbar(t("trashSuccess"), { variant: "success" });
      } catch (e) {
        console.warn(e);
        enqueueSnackbar(t("trashFailed"), { variant: "error" });
      }
    }


    const { downSm } = useResponsive();


    const menuDense = downSm;

    return (
      <>
        <IconButton
          aria-label='post-menu-button'
          size='small'
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
            onClick={handleShareClick}
            dense={menuDense}
          >
            <ListItemIcon>
              <ShareIcon fontSize='small' />
            </ListItemIcon>
            {t("share")}
          </MenuItem>
          <MenuItem
            onClick={handleReportClick}
            dense={menuDense}
          >
            <ListItemIcon>
              <ReportIcon />
            </ListItemIcon>
            {t("report")}
          </MenuItem>
          {Boolean(post.bookmark) ? (
            <MenuItem
              onClick={handleUnbookmarkClick}
              dense={menuDense}
            >
              <ListItemIcon>
                <UnbookmarkOlIcon />
              </ListItemIcon>
              {t("unbookmark")}
            </MenuItem>
          ) : (
            <MenuItem
              onClick={handleBookmarkClick}
              dense={menuDense}
            >
              <ListItemIcon>
                <BookmarkOlIcon />
              </ListItemIcon>
              {t("bookmark")}
            </MenuItem>
          )}

          {/* managing section */}
          {Boolean(manager) && [
            <Divider key='divider' />,
            <Box key='admin-title' mx={2} mb={1}>
              <Txt variant="body3" fontWeight={700}>{t("managerFeature")}</Txt>
            </Box>,
            post.pin ? (
              <MenuItem
                key='cancel-pin'
                onClick={handleUnpinClick}
                dense={menuDense}
                disabled={manager?.manage_intro !== true}
              >
                <ListItemIcon>
                  <UnpinIcon />
                </ListItemIcon>
                {t("unpin")}
              </MenuItem>
            ) : (
              <MenuItem
                key='set-pin'
                onClick={handlePinClick}
                dense={menuDense}
                disabled={manager?.manage_intro !== true}
              >
                <ListItemIcon>
                  <PinIcon />
                </ListItemIcon>
                {t("pin")}
              </MenuItem>
            ),
            <MenuItem
              key='block-user'
              onClick={handleAuthorBlockClick}
              disabled={!Boolean(post.author?.id) || manager?.manage_muter !== true}
              dense={menuDense}
            >
              <ListItemIcon>
                <BlockIcon />
              </ListItemIcon>
              {t("restrictAuthor")}
            </MenuItem>,
          ]}

          {admin && [
            <Divider key='divider2'/>,
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
              {t("trashPost")}
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
        <PostShareDialog
          post={post}
          open={isShareDialogOpen}
          onClose={handleShareDialogClose}
        />
      </>
    );
  },
);
