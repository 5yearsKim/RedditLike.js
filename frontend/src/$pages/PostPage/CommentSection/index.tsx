import React, { useState, useRef } from "react";
import { useTranslations } from "next-intl";
import { Box, IconButton, Avatar } from "@mui/material";
import { useResponsive } from "@/hooks/Responsive";
import { Row, Gap, Expand } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { RetryIcon, SendIcon } from "@/ui/icons";
import { LoadingIndicator } from "@/components/$statusTools";
import { CommentSortChips } from "@/components/CommentSortChips";
import { PostCommentList } from "@/components/PostCommentList";
import { CommentInput } from "@/components/ComentInput";
// logic
import { atom, useRecoilState } from "recoil";
import { initFromStorage } from "@/utils/recoil";
import { useMe, useMeMuter } from "@/stores/UserStore";
// import { managingState } from "@/stores/ManagingStore";
import { useBoardMain$ } from "@/stores/BoardMainStore";
import type { PostCommentListT } from "@/components/PostCommentList";
import { useLoginAlertDialog } from "@/hooks/dialogs/ConfirmDialog";
import type { PostT, CommentT, CommentSortT, ListCommentOptionT } from "@/types";

export type CommentSectionProps = {
  post: PostT;
};

// local recoil states
const sortState = atom<CommentSortT>({
  key: "sort_CommentSection",
  default: "vote",
  effects: [
    initFromStorage<CommentSortT>("sort_CommentSection_default", (val) => {
      if (val == "vote" || val == "recent" || val == "old" || val == "discussed") {
        return val;
      }
      return "vote";
    }),
  ],
});

export function CommentSection({
  post,
}: CommentSectionProps): JSX.Element {
  const t = useTranslations("pages.PostPage.CommentSection");

  const commentListRef = useRef<PostCommentListT | null>(null);
  const { showLoginAlertDialog } = useLoginAlertDialog();

  const { downSm } = useResponsive();
  const me = useMe();
  const muter = useMeMuter();
  const boardMain$ = useBoardMain$();

  const [sort, setSort] = useRecoilState<CommentSortT>(sortState);
  const [regenCnt, setRegenCnt] = useState<number>(0);

  function handleCommentSubmitted(comment: CommentT): void {
    commentListRef.current?.addMyComment(comment);
  }

  function handleSortChange(val: CommentSortT): void {
    setSort(val);
  }

  function handleRegenClick(): void {
    setRegenCnt(regenCnt + 1);
  }

  function handleFakeInputClick(): void {
    showLoginAlertDialog();
  }


  const listOpt: ListCommentOptionT = {
    sort: sort,
    postId: post.id,
    censor: boardMain$.data?.manager ? undefined : "exceptTrashed",
    $defaults: true,
    $manager_defaults: Boolean(boardMain$.data?.manager),
    $author_idx: true,
  };

  function renderFakeCommentInput(): JSX.Element {
    return (
      <Row width='100%'>
        <Avatar
          sx={{
            width: downSm ? 30 : 40,
            height: downSm ? 30 : 40,
          }}
        />
        <Row
          ml={2}
          pl={2}
          flex={1}
          width='100%'
          height={downSm ? 35 : 40}
          borderRadius={2}
          bgcolor='rgba(150, 150, 150, 0.2)'
          sx={{
            cursor: "pointer",
          }}
          onClick={handleFakeInputClick}
        >
          <Txt variant='body2' color='vague.light'>{t("pleaseTypeComment")}</Txt>
          <Expand />
          <IconButton color='primary'>
            <SendIcon />
          </IconButton>
        </Row>
      </Row>
    );
  }


  if (boardMain$.status == "init" || boardMain$.status == "loading") {
    return (
      <LoadingIndicator width='100%' minHeight={200}/>
    );
  }


  const { board } = boardMain$.data!;
  const commentDisabled = Boolean(board.muter) || Boolean(muter);
  return (
    <>
      <Txt variant='h6'>{t("comment")}</Txt>

      <Gap y={2} />
      {me ? (
        commentDisabled ? (
          <Txt color='vague.main'>{t("commentRestricted")}</Txt>
        ) :
          (
            <CommentInput
              me={me}
              postId={post.id}
              onSubmitted={handleCommentSubmitted}
            />
          )
      ) : (
        <> {renderFakeCommentInput()}</>
      )}

      <Gap y={1} />

      <Row
        justifyContent='flex-end'
        width='100%'
      >
        <Row
        // justifyContent='flex-end'
          sx={{
            overflowX: "scroll",
            "::-webkit-scrollbar": {
              display: "none",
            },
          }}
        >
          <IconButton
            aria-label='reload-comments'
            size='small'
            onClick={handleRegenClick}
          >
            <RetryIcon />
          </IconButton>

          <CommentSortChips
            sort={sort}
            size={downSm ? "small" : "medium"}
            onChange={handleSortChange}
          />
        </Row>
      </Row>

      {/* mobile padding */}
      <Box mt={{ xs: 1, sm: 0 }} />

      <Box minHeight={200}>
        <PostCommentList
          ref={commentListRef}
          regenCnt={regenCnt}
          post={post}
          listOpt={listOpt}
          manager={boardMain$.data?.manager}
          repliable={commentDisabled ? false : true}
        />
      </Box>
    </>
  );
}

