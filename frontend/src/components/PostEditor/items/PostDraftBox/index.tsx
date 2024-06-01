"use client";
import React, { useState, useEffect, Fragment, MouseEvent } from "react";
import { useTranslations } from "next-intl";
import { Button, Popover, Box, Divider } from "@mui/material";
import { useResponsive } from "@/hooks/Responsive";
import { Col } from "@/ui/layouts";
import { PostOlIcon } from "@/ui/icons";

import { DraftPostItem } from "./DraftPostItem";
// logic
import { useListData } from "@/hooks/ListData";
import { useAlertDialog } from "@/hooks/dialogs/ConfirmDialog";
import type { UserT, PostT, ListPostOptionT } from "@/types";
import * as PostApi from "@/apis/posts";


export const PostDraftBox = React.memo(_PostDraftBox, (p, n) => {
  return p.boardId == n.boardId && p.currentPostId == n.currentPostId && p.me.id == n.me.id;
});

type PostDraftBoxProps = {
  me: UserT;
  boardId: idT;
  currentPostId?: idT;
  onApply: (post: PostT) => any;
};

function _PostDraftBox({
  me,
  boardId,
  currentPostId,
  onApply,
}: PostDraftBoxProps): JSX.Element {
  const t = useTranslations("components.PostEditor.PostDraftBox");
  const { downMd, downSm } = useResponsive();

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const { showAlertDialog } = useAlertDialog();

  const { data: posts$, actions: postsAct } = useListData({
    listFn: PostApi.list,
  });

  const listOpt: ListPostOptionT = {
    boardId,
    authorId: me.id,
    published: "except",
  };

  useEffect(() => {
    if (boardId) {
      // boardId loaded late on refresh
      postsAct.load(listOpt);
    }
  }, [boardId]);

  // on draft change
  useEffect(() => {
    postsAct.load(listOpt, { force: true });
  }, [currentPostId]);

  function handleOpenClick(e: MouseEvent<HTMLButtonElement>): void {
    setAnchorEl(e.currentTarget);
  }

  function handleClose(): void {
    setAnchorEl(null);
  }

  async function handleDraftDelete(post: PostT): Promise<void> {
    const isOk = await showAlertDialog({
      title: t("deleteDraft"),
      body: t("deleteDraftMsg"),
      useCancel: true,
      useOk: true,
    });
    if (!isOk) {
      return;
    }
    try {
      await PostApi.remove(post.id);
      postsAct.load(listOpt, { force: true, skipLoading: true });
    } catch (e) {
      console.warn(e);
    }
  }

  async function handleDraftSelect(post: PostT): Promise<void> {
    const isOk = await showAlertDialog({
      title: t("restoreDraft"),
      body: t("restoreDraftMsg"),
      useCancel: true,
      useOk: true,
    });
    if (!isOk) {
      return;
    }
    setAnchorEl(null);
    onApply(post);
  }

  const posts = posts$.data;

  if (!posts.length) {
    return <Fragment />;
  }

  return (
    <>
      <Button
        variant='text'
        onClick={handleOpenClick}
        size={downSm ? "small" : "medium"}
        startIcon={<PostOlIcon />}
      >
        {t("savedDrafts", { n: posts.length })}
      </Button>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        anchorOrigin={{
          horizontal: downMd ? "left" : "center",
          vertical: "bottom",
        }}
        onClose={handleClose}
        disableScrollLock
        sx={{
          maxHeight: "600px",
        }}
      >
        <Box
          width={downMd ? "250px" : "350px"}
          display='flex'
          flexDirection='column'
          pt={1}
        >
          <Col
            width='100%'
            divider={<Divider />}
          >
            {posts.map((post) => {
              return (
                <Fragment key={post.id}>
                  <DraftPostItem
                    post={post}
                    isChecked={post.id == currentPostId}
                    onClick={handleDraftSelect}
                    onDelete={handleDraftDelete}
                  />
                </Fragment>
              );
            })}
          </Col>
        </Box>
      </Popover>
    </>
  );
}
