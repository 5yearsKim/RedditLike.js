import { PostBookmarkFormT, PostBookmarkT } from "./PostBookmark";

// (POST) /
export type CreateRqs = {form: PostBookmarkFormT}
export type CreateRsp = PostBookmarkT

// (DELETE) /:id
export type DeleteRqs = null
export type DeleteRsp = PostBookmarkT
