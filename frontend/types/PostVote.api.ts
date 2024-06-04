import type { PostVoteT } from "./PostVote";

// (POST) /score
export type ScoreRqs = {postId: number, score: number}
export type ScoreRsp = PostVoteT|null

