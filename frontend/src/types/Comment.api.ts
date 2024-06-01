import type {
  CommentT, CommentFormT, GetCommentOptionT, ListCommentOptionT,
} from "./Comment";
import type { CommentManagingLogT } from "./CommentManagingLog";


// (POST) /
export type CreateRqs = {form: CommentFormT }
export type CreateRsp = CommentT

// (GET) /:id
export type GetRqs = GetCommentOptionT
export type GetRsp = GetData<CommentT>

// (PATCH) /:id
export type UpdateRqs = {form: Partial<CommentFormT>}
export type UpdateRsp = CommentT

// (DELETE) /:id
export type DeleteRqs = null
export type DeleteRsp = CommentT

// (GET) /
export type ListRqs = ListCommentOptionT
export type ListRsp = ListData<CommentT>

// (GET) /skim
export type SkimRqs = ListCommentOptionT
export type SkimRsp = ListData<CommentT>


// (GET) /:id/with-children
export type GetWithChildrenRqs = ListCommentOptionT
export type GetWithChildrenRsp = GetData<CommentT>

// (PATCH) /:id/approve
export type ApproveRqs = null
export type ApproveRsp = {comment: CommentT, log: CommentManagingLogT}

// (PATCH) /:id/trash
export type TrashRqs = {reason: string}
export type TrashRsp = {comment: CommentT, log: CommentManagingLogT}

// (PATCH) /:id/admin-trash
export type AdminTrashRqs = {reason: string}
export type AdminTrashRsp = {comment: CommentT, log: CommentManagingLogT}
