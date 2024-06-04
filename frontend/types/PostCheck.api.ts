import { PostCheckT } from "./PostCheck";

// (POST) /check
export type CheckRqs = {postId: idT, type: "user"|"ip"|"dummy" }
export type CheckRsp = PostCheckT|null