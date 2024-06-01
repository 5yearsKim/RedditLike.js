"use client";
import React from "react";
import { PostList } from "@/components/PostList";
import { useMe } from "@/stores/UserStore";
import { useResponsive } from "@/hooks/Responsive";
import type { ReportFilterT, BoardManagerT, ListPostOptionT } from "@/types";

type PostReportSectionProps = {
  boardId: idT;
  reportFilter: ReportFilterT;
  manager: BoardManagerT;
};

export function PostReportSection({
  boardId,
  reportFilter,
  manager,
}: PostReportSectionProps): JSX.Element {
  const me = useMe();
  const { downSm } = useResponsive();

  const listOpt: ListPostOptionT = {
    userId: me?.id,
    sort: "recent",
    boardId,
    report: reportFilter,
    $defaults: true,
    $user_defaults: true,
    $manager_defaults: true,
  };

  return (
    <PostList
      // currentHref={{ pathname: '/managings/[boardId]/report', query: { boardId } }}
      listOpt={listOpt}
      getPostProps={(post) => {
        return {
          post,
          isManaging: true,
          manager,
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
