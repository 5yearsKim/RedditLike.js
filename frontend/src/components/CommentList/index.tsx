import React, { Fragment, ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Box, Row } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { ListView } from "@/ui/tools/ListView";
import { InitBox, LoadingIndicator, ErrorBox } from "@/components/$statusTools";
import { CommentItem } from "@/components/CommentItem";
import { MainTxt } from "./style";
// logic
import { useEffect } from "react";
import { useResponsive } from "@/hooks/Responsive";
import { useRouter } from "next/navigation";
import { useListData } from "@/hooks/ListData";
import { useFocusComment } from "@/hooks/FocusComment";
import { usePostDialog } from "@/hooks/dialogs/PostDialog";
import * as CommentApi from "@/apis/comments";
import { updateCommentEv } from "@/system/global_events";
import type { PostT, CommentT, ListCommentOptionT, BoardManagerT } from "@/types";

type CommentListProps = {
  post?: PostT;
  listOpt: ListCommentOptionT;
  manager?: BoardManagerT | null;
};

export function CommentList({
  post,
  listOpt,
  manager,
}: CommentListProps): ReactNode {
  const t = useTranslations("components.CommentList");
  const { downSm } = useResponsive();
  const router = useRouter();

  const { data: comments$, actions: commentsAct } = useListData({
    listFn: CommentApi.list,
  });
  const { openPostDialogById } = usePostDialog();
  const { focusComment } = useFocusComment();

  useEffect(() => {
    commentsAct.load(listOpt);
  }, [listOpt.report]);

  useEffect(() => {
    updateCommentEv.addListener("commentList", (comment) => {
      if (comments$.data.some((item) => item.id == comment.id)) {
        _handleCommentUpdated(comment);
      }
    });
    return (): void => updateCommentEv.removeListener("commentList");
  }, [comments$.data]);

  function _handleCommentUpdated(item: CommentT): void {
    commentsAct.replaceItem(item);
  }

  function handleLoaderDetect(): void {
    commentsAct.refill();
  }

  function handlePostTitleClick(postId: idT): void {
    if (downSm) {
      router.push(`/posts/${postId}`);
    } else {
      openPostDialogById(postId);
    }
  }

  function handleCommentClick(comment: CommentT): void {
    const postId = comment.post_id;
    if (downSm) {
      router.push(`/posts/${postId}`);
    } else {
      openPostDialogById(postId);
    }
    focusComment(comment.id);
  }


  const { status, data: comments } = comments$;

  if (status == "init") {
    return <InitBox />;
  }
  if (status == "loading") {
    return (
      <Row
        width='100%'
        justifyContent='center'
      >
        <LoadingIndicator />
      </Row>
    );
  }
  if (status == "error") {
    return <ErrorBox />;
  }

  if (comments.length == 0) {
    return (
      <Box p={2}>
        <Txt
          variant='subtitle2'
          color='vague.main'
          textAlign='center'
        >
          {t("noComments")}
        </Txt>
      </Box>
    );
  }

  return (
    <ListView
      data={comments}
      onLoaderDetect={handleLoaderDetect}
      renderItem={(item): JSX.Element => {
        return (
          <Fragment key={item.id}>
            <Box
              width='100%'
              mb={4}
            >
              {item.post && (
                <Box color='vague.main'>
                  {item.parent ? t("commentOnComment") : t("commentOnPost")}
                  <MainTxt onClick={(): void => handlePostTitleClick(item.post!.id)}>{`'${item.post.title}'`}</MainTxt>
                  {/* {Boolean(item.parent) && "의 댓글"} */}
                </Box>
              )}
              <Box onClick={(): void => handleCommentClick(item)}>
                <CommentItem
                  post={post ?? (item.post as PostT) ?? null}
                  comment={item}
                  manager={manager ?? undefined}
                  focusDisabled={true}
                  childrenLoadFn={async (comment) => {
                    const rsp = await CommentApi.getWithChildren(comment.id, listOpt);
                    return rsp.data;
                  }}
                />
              </Box>
            </Box>
          </Fragment>
        );
      }}
    />
  );
}
