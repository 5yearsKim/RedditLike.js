import React, { useEffect, useImperativeHandle, forwardRef, Fragment } from "react";
import { useTranslations } from "next-intl";
import { ListView, AppendLoading, AppendError } from "@/ui/tools/ListView";
import { VirtualScrollItem } from "@/ui/tools/VirtualScrollItem";
import { Center, Row, Gap } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { InfoOlIcon } from "@/ui/icons";
import { CommentItem } from "@/components/CommentItem";
import { InitBox, LoadingIndicator, ErrorBox } from "@/components/$statusTools";
// logic
import * as CommentApi from "@/apis/comments";
import { useListData } from "@/hooks/ListData";
import { useFocusComment } from "@/hooks/FocusComment";
import { updateCommentEv } from "@/system/global_events";
import type {
  PostT, ListCommentOptionT, BoardManagerT, CommentT,
} from "@/types";

export type PostCommentListT = {
  addMyComment: (comment: CommentT) => void;
};

type PostCommentListProps = {
  post: PostT | null;
  listOpt: ListCommentOptionT;
  regenCnt?: number;
  manager?: BoardManagerT | null;
  repliable?: boolean; // default true
};

export const PostCommentList = forwardRef<PostCommentListT, PostCommentListProps>(
  (props: PostCommentListProps, ref): JSX.Element => {
    const {
      post,
      listOpt,
      regenCnt,
      manager,
      repliable,
    } = props;

    const t = useTranslations("components.PostCommentList");

    const { data: comments$, actions: commentsAct } = useListData({
      listFn: CommentApi.skim,
    });
    const { focusComment } = useFocusComment();

    // const me = useValue(meState_me);

    useImperativeHandle(ref, () => ({
      addMyComment(comment: CommentT): void {
        commentsAct.splice(0, 0, comment);
        focusComment(comment.id);
      },
    }));

    useEffect(() => {
      commentsAct.load(listOpt);
    }, [JSON.stringify(listOpt)]);

    useEffect(() => {
      if (regenCnt) {
      // regenCnt exsts and regenCnt > 0
        commentsAct.load(listOpt, { force: true });
      }
    }, [regenCnt]);

    useEffect(() => {
      updateCommentEv.addListener("postCommentList", (val) => {
        _handleUpdated(val);
      });
      return (): void => {
        updateCommentEv.removeListener("postCommentList");
      };
    }, [comments$.data]);

    function handleErrorRetry(): void {
      commentsAct.load(listOpt, { force: true });
    }

    function handleLoaderDetect(): void {
      commentsAct.refill();
    }

    function handleRefillRetry(): void {
      commentsAct.refill();
    }

    function _handleUpdated(comment: CommentT): void {
      const [found, newComments] = _findAndReplace(comments$.data, comment);
      if (found) {
        commentsAct.patch({ data: newComments });
      }
    }

    function _findAndReplace(comments: CommentT[], item: CommentT): [boolean, CommentT[]] {
      for (let idx = 0; idx < comments.length; idx++) {
        const comm = comments[idx];
        if (comm.id == item.id) {
          const newAns = [...comments];
          newAns.splice(idx, 1, item);
          return [true, newAns];
        } else if (comm.children?.length) {
          const [found, children] = _findAndReplace(comm.children, item);
          if (found) {
            const newComm = { ...comm, children: children };
            const newAns = [...comments];
            newAns.splice(idx, 1, newComm);
            return [true, newAns];
          }
        }
      }
      return [false, comments];
    }

    const { status, appendingStatus, data: comments } = comments$;


    if (status === "init") {
      return <InitBox />;
    }
    if (status === "loading") {
      return (
        <Center width='100%'>
          <LoadingIndicator p={2} />
        </Center>
      );
    }
    if (status === "error") {
      return <ErrorBox onRetry={handleErrorRetry} />;
    }

    if (comments.length == 0) {
      return (
        <Row
          justifyContent='center'
          width='100%'
          mt={2}
        >
          <InfoOlIcon sx={{ fontSize: 22, color: "vague.main" }} />
          <Gap x={1} />
          <Txt sx={{ color: "vague.main" }} variant='body1'>{t("noComments")}</Txt>
        </Row>
      );
    }

    return (
      <ListView
        data={comments}
        onLoaderDetect={handleLoaderDetect}
        renderItem={(comm, idx): JSX.Element => {
          const forceRender = idx < 12;
          return (
            <Fragment key={`comm-${comm.id}`}>
              <VirtualScrollItem
                minHeight={100}
                forceRender={forceRender}
              >
                <CommentItem
                  key={comm.id}
                  comment={comm}
                  post={post}
                  shrink
                  manager={manager ?? undefined}
                  repliable={repliable ?? true}
                  childrenLoadFn={async (comment) => {
                    const { data } = await CommentApi.getWithChildren(comment.id, listOpt);
                    return data;
                  }}
                />
              </VirtualScrollItem>
            </Fragment>
          );
        }}
        renderAppend={(): JSX.Element => {
          if (appendingStatus === "loading") {
            return (
              <Center width='100%'>
                <AppendLoading />
              </Center>
            );
          }
          if (appendingStatus === "error") {
            return (
              <Center width='100%'>
                <AppendError onRetry={handleRefillRetry} />
              </Center>
            );
          }
          return <></>;
        }}
      />
    );
  },
);
