"use client";
import React, { ReactNode } from "react";
import { PostList } from "@/components/PostList";
import { useMe } from "@/stores/UserStore";
import { useResponsive } from "@/hooks/Responsive";
import type { PostSortT, CensorFilterT, BoardManagerT, ListPostOptionT } from "@/types";

export const BoardPostList = React.memo(_BoardPostList);

type BoardPostListProps = {
  sort: PostSortT;
  fromAt: Date | undefined;
  censor?: CensorFilterT;
  manager: BoardManagerT;
  boardId: idT;
};

function _BoardPostList({
  sort,
  fromAt,
  censor,
  manager,
  boardId,
}: BoardPostListProps): ReactNode {
  const { downSm } = useResponsive();
  const me = useMe();

  const listOpt: ListPostOptionT = {
    $defaults: true,
    $user_defaults: true,
    userId: me?.id,
    sort: sort,
    fromAt: fromAt,
    boardId: boardId,
    censor: censor,
  };

  return (
    <PostList
      listOpt={listOpt}
      getPostProps={(post) => {
        return {
          post,
          isManaging: true,
          manager: manager,
          size: downSm ? "small" : "medium",
          fingerprintProps: {
            isMe: Boolean(me) && me?.id === post.author?.id,
            isManager: post.show_manager && post.author?.is_manager,
          },
        };
      }}

    />
  );
}
