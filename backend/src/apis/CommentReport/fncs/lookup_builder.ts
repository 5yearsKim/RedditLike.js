import { commentReportM, CommentReportSqls } from "@/models/CommentReport";
import type { GetCommentReportOptionT } from "@/types";

export function lookupBuilder(select: any[], getOpt: GetCommentReportOptionT) {
  const sqls = new CommentReportSqls(commentReportM.table);
}