import { PostReportFormT, PostReportT, ListPostReportOptionT } from "./PostReport";

// (POST) /
export type CreateRqs = {form: PostReportFormT}
export type CreateRsp = PostReportT

// (GET) /
export type ListRqs = ListPostReportOptionT
export type ListRsp = ListData<PostReportT>

// (PATCH) /:reportId/ignore
export type IgnoreRqs = null
export type IgnoreRsp = PostReportT

// (PATCH) /:reportId/resolve
export type ResolveRqs = null
export type ResolveRsp = PostReportT