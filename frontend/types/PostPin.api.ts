import type { PostPinFormT, PostPinT } from "./PostPin";

// (POST) /
export type CreateRqs = {form: PostPinFormT}
export type CreateRsp = PostPinT

// (DELETE) /
export type DeleteRqs = {boardId: idT, postId: idT}
export type DeleteRsp = PostPinT