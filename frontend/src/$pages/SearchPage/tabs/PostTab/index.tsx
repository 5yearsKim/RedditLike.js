"use client";
import React, { ReactNode } from "react";
import { Container } from "@/ui/layouts";
import { PostList } from "@/components/PostList";
import { useResponsive } from "@/hooks/Responsive";
import type { ListPostOptionT } from "@/types";

type SearchPostProps = {
  q: string;
};

export function PostTab({ q }: SearchPostProps): ReactNode {
  const { downSm } = useResponsive();

  const listOpt: ListPostOptionT = {
    sort: "recent",
    search: q ?? "",
    censor: "exceptTrashed",
    block: "except",
    $defaults: true,
    $user_defaults: true,
    $board: true,
  };

  return (
    <Container maxWidth='sm'>
      <PostList
        listOpt={listOpt}
        getPostProps={(post) => ({
          post,
          showBoard: true,
          size: downSm ? "small" : "medium",
        })}
      />
    </Container>
  );
}
