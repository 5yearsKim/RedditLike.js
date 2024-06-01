import type { CommentReportFormT, CommentReportT, ListCommentReportOptionT } from "./CommentReport";

// (POST) /
export type CreateRqs = {form: CommentReportFormT}
export type CreateRsp = CommentReportT


// (GET) /
export type ListRqs = ListCommentReportOptionT
export type ListRsp = ListData<CommentReportT>

// (PATCH) /:reportId/ignore
export type IgnoreRqs = null
export type IgnoreRsp = CommentReportT

// (PATCH) /:reportId/resolve
export type ResolveRqs = null
export type ResolveRsp = CommentReportT