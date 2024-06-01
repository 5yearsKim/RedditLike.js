"use client";
import React, { ReactNode } from "react";
import { PostList } from "@/components/PostList";
import { useResponsive } from "@/hooks/Responsive";
import { useMe } from "@/stores/UserStore";
import { useGroup } from "@/stores/GroupStore";
import type { ListPostOptionT } from "@/types";

type HotPostListProps = {
  fromAt: Date | undefined;
};

export function HotPostList({ fromAt }: HotPostListProps): ReactNode {
  const me = useMe();
  const group = useGroup();
  const { downSm } = useResponsive();

  const listOption: ListPostOptionT = {
    $defaults: true,
    $user_defaults: true,
    $board: true,
    sort: "vote",
    fromAt: fromAt,
    block: "except",
    censor: "exceptTrashed",
    userId: me?.id,
    groupId: group.id,
  };

  return (
    <PostList
      // showBoard
      listOpt={listOption}
      getPostProps={(post) => {
        return {
          post: post,
          showBoard: true,
          size: downSm ? "small" : "medium",
          fingerprintProps: {
            isMe: Boolean(me) && me?.id === post.author?.id,
          },
        };
      }}
    />
  );
}
