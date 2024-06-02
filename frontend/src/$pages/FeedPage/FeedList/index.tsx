import React from "react";
import { useResponsive } from "@/hooks/Responsive";
import { PostList } from "@/components/PostList";
import { useMe } from "@/stores/UserStore";
import { PostSortT, ListPostOptionT } from "@/types";

export type FeedListProps = {
  sort: PostSortT;
  fromAt: Date | undefined;
  regenCnt: number;
  following?: "only" | "except";
};

export function FeedList({
  sort,
  fromAt,
  regenCnt,
  following,
}: FeedListProps): JSX.Element {

  const me = useMe();
  const { downSm } = useResponsive();

  const listOpt: ListPostOptionT = {
    $defaults: true,
    $user_defaults: true,
    $board: true,
    userId: me?.id,
    sort: sort,
    fromAt: fromAt,
    block: "except",
    censor: "exceptTrashed",
    following: following,
  };

  return (
    <PostList
      regenCnt={regenCnt}
      listOpt={listOpt}
      getPostProps={(post) => {
        return {
          post,
          isManaging: false,
          manager: null,
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
