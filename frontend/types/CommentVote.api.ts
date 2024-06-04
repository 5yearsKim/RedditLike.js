import { CommentVoteT } from "./CommentVote";


// (POST) /score
export type ScoreRqs = {commentId: number, score: number}
export type ScoreRsp = CommentVoteT|null