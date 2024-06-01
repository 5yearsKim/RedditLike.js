import React from "react";
import { CommentList } from "@/components/CommentList";
import type { ReportFilterT, BoardManagerT, ListCommentOptionT } from "@/types";

export type CommentReportSectionProps = {
  boardId: idT;
  reportFilter: ReportFilterT;
  manager: BoardManagerT;
};

export function CommentReportSection(props: CommentReportSectionProps): JSX.Element {
  const { boardId, reportFilter, manager } = props;

  const listOpt: ListCommentOptionT = {
    sort: "recent",
    boardId,
    report: reportFilter,
    $defaults: true,
    $manager_defaults: true,
    $post: true,
  };

  return (
    <CommentList
      listOpt={listOpt}
      manager={manager}
    />
  );
}
