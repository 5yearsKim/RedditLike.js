import type { PostT, PostFormT, GetPostOptionT, ListPostOptionT } from "./Post";
import { PostManagingLogT } from "./PostManagingLog";
import type { ImageT } from "./Image";
import type { VideoT } from "./Video";
import type { FlagT } from "./Flag";

// (POST) /
export type CreateRqs = {
  form: PostFormT,
  relations?: {
    images?: ImageT[],
    videos?: VideoT[],
    flags?: FlagT[],
  }
}
export type CreateRsp = PostT

// (GET) /:id
export type GetRqs = GetPostOptionT
export type GetRsp = GetData<PostT>


// (PATCH) /:id
export type UpdateRqs = {
  form: Partial<PostFormT>,
  relations?: {
    images?: ImageT[],
    videos?: VideoT[],
    flags?: FlagT[],
  }
}
export type UpdateRsp = PostT

// (DELETE) /:id
export type DeleteRqs = null
export type DeleteRsp = PostT

// (GET) /
export type ListRqs = ListPostOptionT
export type ListRsp = ListData<PostT>

// (POST) /images/presigned-url
export type ImagePresignedUrlRqs = { mimeType: string };
export type ImagePresignedUrlRsp = { putUrl: string, key: string }


// (POST) /videos/presigned-url
export type VideoPresignedUrlRqs = { mimeType: string };
export type VideoPresignedUrlRsp = { putUrl: string, key: string }


// (PATCH) /:id/approve
export type ApproveRqs = null
export type ApproveRsp = {post: PostT, log: PostManagingLogT}

// (PATCH) /:id/trash
export type TrashRqs = {reason: string}
export type TrashRsp = {post: PostT, log: PostManagingLogT}

// (PATCH) /:id/admin-trash
export type AdminTrashRqs = {reason: string}
export type AdminTrashRsp = {post: PostT, log: PostManagingLogT}


