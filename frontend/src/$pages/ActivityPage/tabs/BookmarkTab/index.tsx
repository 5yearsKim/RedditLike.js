import React from "react";
import { Container } from "@/ui/layouts";
import { PostList } from "@/components/PostList";
import { useResponsive } from "@/hooks/Responsive";
import type { UserT, ListPostOptionT } from "@/types";

export type BookmarkTabProps = {
  me: UserT;
};

export function BookmarkTab({
  me,
}: BookmarkTabProps): JSX.Element {
  const { downSm } = useResponsive();

  const listOption: ListPostOptionT = {
    userId: me?.id,
    bookmark: "only",
    sort: "recent",
    censor: "exceptTrashed",
    $defaults: true,
    $user_defaults: true,
    $board: true,
  };

  return (
    <Container maxWidth='sm'>
      <PostList
        listOpt={listOption}
        getPostProps={(post) => {
          return {
            post,
            showBoard: true,
            size: downSm ? "small" : "medium",
            fingerprintProps: {
              isMe: Boolean(me) && me?.id === post.author?.id,
            },
          };
        }}
      />
    </Container>
  );
}
