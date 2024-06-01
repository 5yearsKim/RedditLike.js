"use client";
import React from "react";
import { Container } from "@/ui/layouts";
import { PostList } from "@/components/PostList";
import { useResponsive } from "@/hooks/Responsive";
import type { UserT, ListPostOptionT } from "@/types";

type PostTabProps = {
  me: UserT;
};

export function PostTab({ me }: PostTabProps): JSX.Element {
  const { downSm } = useResponsive();

  const listOption: ListPostOptionT = {
    authorId: me.id,
    sort: "recent",
    userId: me?.id,
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
