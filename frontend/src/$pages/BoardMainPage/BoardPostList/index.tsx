import React, { ReactNode } from "react";

import { PostList } from "@/components/PostList";
import { useResponsive } from "@/hooks/Responsive";
import { useMe } from "@/stores/UserStore";
import type { PostSortT, BoardManagerT, FlagT, ListPostOptionT } from "@/types";

type BoardPostListProps = {
  sort: PostSortT;
  fromAt: Date | undefined;
  manager: BoardManagerT | null;
  boardId: idT;
  regenCnt: number;
  search?: string|null;
  flagFilter?: FlagT | null;
  authorId?: idT;
};

export function BoardPostList({
  sort,
  fromAt,
  manager,
  boardId,
  regenCnt,
  search,
  flagFilter,
  authorId,
}: BoardPostListProps): ReactNode {

  const me = useMe();
  const { downSm } = useResponsive();

  const listOpt: ListPostOptionT = {
    userId: me?.id,
    sort: sort,
    fromAt: fromAt,
    boardId: boardId,
    censor: manager ? undefined : "exceptTrashed",
    flagId: flagFilter?.id ?? undefined,
    // limit: 4,
    $defaults: true,
    $user_defaults: true,
    $manager_defaults: Boolean(manager),
    $pin: true,
  };

  if (search) {
    listOpt.search = search;
  }
  if (authorId) {
    listOpt.authorId = authorId;
  }

  return (
    <PostList
      // currentHref={{ pathname: '/boards/[boardId]', query: { boardId } }}
      listOpt={listOpt}
      regenCnt={regenCnt}
      getPostProps={(post) => ({
        post,
        manager,
        showBoard: false,
        size: downSm ? "small" : "medium",
        fingerprintProps: {
          isMe: Boolean(me) && me?.id === post.author?.id,
          isManager: post.show_manager && post.author?.is_manager,
        },
      })}
    />
  );
}
