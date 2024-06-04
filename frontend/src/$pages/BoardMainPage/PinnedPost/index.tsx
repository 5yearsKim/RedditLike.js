import React, { Fragment, useEffect, useState, ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Box, type BoxProps, Collapse, Button } from "@mui/material";
import { useResponsive } from "@/hooks/Responsive";
import { PinIcon, FoldIcon, UnfoldIcon } from "@/ui/icons";
import { Row, Gap } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { PinnedPostItem } from "./PinnedPostItem";

// logic
import { atom } from "recoil";
import { useRouter } from "next/navigation";
import { useListDataStore, type ListDataT } from "@/stores/molds/list_data";
import { usePostDialog } from "@/hooks/dialogs/PostDialog";
import * as PostApi from "@/apis/posts";
import type { PostT, ListPostOptionT } from "@/types/Post";


type PinnedPostProps = {
  boardId: idT;
};

const pinnedPostsState = atom<ListDataT<PostT, ListPostOptionT>>({
  key: "pinnedPostsState",
  default: {
    status: "init",
    listArg: {} as ListPostOptionT,
    data: [],
    nextCursor: null,
    appendingStatus: "init",
    lastUpdated: null,
  },
});

export const PinnedPost = React.memo(_PinnedPost);

function _PinnedPost({
  boardId,
}: PinnedPostProps): ReactNode {
  const t = useTranslations("pages.BoardMainPage.PinnedPost");
  const router = useRouter();

  const [isExpand, setIsExpand] = useState<boolean>(false);
  const [maxPin, setMaxPin] = useState<number>(3);

  const { downSm } = useResponsive();
  const { openPostDialogById } = usePostDialog();

  const { data: posts$, actions: postsAct } = useListDataStore<PostT, ListPostOptionT>({
    listFn: PostApi.list,
    recoilState: pinnedPostsState,
    cacheCfg: {
      genKey: (opt) => `pinnedPosts_${opt.boardId}`,
      ttl: 1000 * 60 * 5,
    },
  });

  const listOpt: ListPostOptionT = {
    boardId,
    limit: 20,
    pin: "only",
    censor: "exceptTrashed",
  };

  useEffect(() => {
    postsAct.load(listOpt);
  }, [boardId]);

  function handleExpand(): void {
    setIsExpand(true);
  }

  function handleFold(): void {
    setIsExpand(false);
    setMaxPin(1);
  }

  function handlePostClick(post: PostT): void {
    if (downSm) {
      router.push(`/posts/${post.id}`);
    } else {
      openPostDialogById(post.id);
    }
  }


  // view
  const { status, data: posts } = posts$;

  if (status !== "loaded" || !posts?.length) {
    return <Fragment />;
  }

  const boxProps: BoxProps = downSm
    ? {
      px: 1,
      py: 1,
      mb: 2,
      borderRadius: 1,
      bgcolor: "paper.main",
      boxShadow: "0px 0px 5px 0px rgba(0, 0, 0, 0.1)",
    }
    : {
      px: 2,
      py: 1,
      mb: 1,
      borderRadius: 1,
      bgcolor: "paper.main",
      boxShadow: "0px 5px 10px 0px rgba(0, 0, 0, 0.2)",
    };

  return (
    <Box {...boxProps}>
      <Row>
        <PinIcon
          color='primary'
          fontSize='small'
        />
        <Gap x={1} />
        <Txt
          variant='body2'
          fontWeight={700}
        >
          {t("pinnedPost")}
        </Txt>
      </Row>

      <Box mt={0.5} />

      {posts.slice(0, maxPin).map((post) => {
        return (
          <Fragment key={post.id}>
            <PinnedPostItem
              post={post}
              onClick={(): void => handlePostClick(post)}
            />
          </Fragment>
        );
      })}
      {posts.length > maxPin && (
        <Fragment>
          <Collapse in={isExpand}>
            {posts.slice(maxPin).map((post) => {
              return (
                <Fragment key={post.id}>
                  <PinnedPostItem
                    post={post}
                    onClick={(): void => handlePostClick(post)}
                  />
                </Fragment>
              );
            })}
          </Collapse>

          {!isExpand && (
            <Button
              size='small'
              fullWidth
              onClick={handleExpand}
              endIcon={<UnfoldIcon />}
            >
              {t("expand")}
            </Button>
          )}
          {isExpand && (
            <Button
              size='small'
              fullWidth
              onClick={handleFold}
              endIcon={<FoldIcon />}
            >
              {t("fold")}
            </Button>
          )}
        </Fragment>
      )}
    </Box>
  );
}
