import { BoardFollowerT, BoardFollowerFormT } from "./BoardFollower";

// (POST) /follow
export type FollowRqs = {boardId: idT}
export type FollowRsp = BoardFollowerT

// (POST) /unfollow
export type UnfollowRqs = {boardId: idT}
export type UnfollowRsp = BoardFollowerT

// (POST) /
export type CreateRqs = {form: BoardFollowerFormT}
export type CreateRsp = BoardFollowerT

// (DELETE) /:id
export type DeleteRqs = null
export type DeleteRsp = BoardFollowerT