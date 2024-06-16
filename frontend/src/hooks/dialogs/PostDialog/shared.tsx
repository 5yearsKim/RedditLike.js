"use client";
import React, { useEffect, ReactNode } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { IconButton, Button, Dialog } from "@mui/material";
import { useResponsive } from "@/hooks/Responsive";
import { Row, Box } from "@/ui/layouts";
import { CloseIcon } from "@/ui/icons";
import { PostPageContent } from "@/$pages/PostPage";
import { LoadingBox, ErrorBox } from "@/components/$statusTools";
// logic
import { useRecoilValue } from "recoil";
import { updatePostEv } from "@/system/global_events";
import { usePostMain$, usePostMainActions } from "@/stores/PostMainStore";
import { postDialogState, usePostDialog } from "./hook";
import type { PostT } from "@/types";

export function PostDialogShared(): ReactNode {
  const t = useTranslations("hooks.dialogs.PostDialog");

  const postMain$ = usePostMain$();
  const postMainAct = usePostMainActions();

  const postDialogAct = usePostDialog();
  const { postId } = useRecoilValue(postDialogState);
  const isOpen = Boolean(postId);

  // init post$
  useEffect(() => {
    if (postId) {
      // if (cachedPost) {
      //   postMainAct.set((state) => ({
      //     ...state,
      //     data: {
      //       post: cachedPost,
      //       ...state.data,
      //     },
      //   }));
      // }
      postMainAct.load({ id: postId });
    }
  }, [postId]);

  // TO FIX
  // // detect rouer back to close dialog
  // useEffect(() => {
  //   router.beforePopState(() => {
  //     if (postId) {
  //       // window.history.pushState(null, '', router.asPath);
  //       handleClose();
  //       return false;
  //     }
  //     return true;
  //   });

  //   return (): void => router.beforePopState(() => true);
  // }, [router, postMain$.data]);

  function handleClose(): void {
    postDialogAct.closePostDialog();
    postMainAct.reset();
    if (postMain$.data?.post) {
      updatePostEv.emit(postMain$.data!.post);
    }
    // // TO FIX
    // if (router.query.commentId) {
    //   const { pathname, query } = router;
    //   delete router.query.commentId;
    //   router.replace({ pathname, query }, undefined, { shallow: true });
    // }
  }

  function handlePostUpdated(post: PostT): void {
    postMainAct.set((state) => ({ ...state, data: { ...state.data, post } }));
  }

  function handleErrorRetry(): void {
    postMainAct.load({ id: postId! }, { force: true });
  }

  const { downSm } = useResponsive();

  const { status, data } = postMain$;

  function renderAction(): ReactNode {
    if (downSm) {
      return (
        <Row
          position='fixed'
          top={0}
          right={0}
        >
          <IconButton
            aria-label='close-post-dialog-button'
            onClick={(e): void => {
              e.stopPropagation();
              e.preventDefault();
              handleClose();
            }}
            size='large'
            color='primary'
          >
            <CloseIcon sx={{ color: "black" }} />
          </IconButton>
        </Row>
      );
    } else {
      return (
        <Row
          position='fixed'
          top={0}
          right={0}
        >
          <Link href={`/posts/${postId}`}>
            <Button
              color='white'
              size='small'
              onClick={handleClose}
            >
              {t("moveToPage")}
            </Button>
          </Link>
          <IconButton
            aria-label='close-post-dialog-button'
            onClick={(e): void => {
              e.stopPropagation();
              e.preventDefault();
              handleClose();
            }}
            size='large'
            color='white'
          >
            <CloseIcon />
          </IconButton>
        </Row>
      );
    }
  }

  function renderContent(): ReactNode {
    if (status == "init" || status == "loading") {
      return (
        <LoadingBox/>
      );
    } else if (status == "error") {
      return (
        <ErrorBox
          onRetry={handleErrorRetry}
        />
      );
    } else{
      return (
        <PostPageContent
          post={data!.post}
          isCached={status !== "loaded"}
          logVisit
          onUpdated={handlePostUpdated}
        />
      );
    }
  }

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      fullScreen={downSm ? true : false}
      scroll='body'
      fullWidth
      maxWidth='md'
      PaperProps={{ elevation: 1 }}
      sx={{
        backdropFilter: "blur(5px)",
      }}
    >
      <>
        {renderAction()}
        <Box
          width='100%'
          // minHeight='85vh'
          maxWidth='800px'
          margin='auto'
          px={2}
          pt={2}
        // height={downSm ? undefined : '90vh'}
        >
          {renderContent()}
        </Box>
      </>
    </Dialog>
  );
}
