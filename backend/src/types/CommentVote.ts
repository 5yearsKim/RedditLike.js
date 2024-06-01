export type CommentVoteFormT = {
    user_id: number;
    comment_id: number;
    score: number;
}

export type CommentVoteT = {
    id: number;
    created_at: Date;
    updated_at?: Date | undefined;
    user_id: number;
    comment_id: number;
    score: number;
}
