export type PostVoteFormT = {
    user_id: number;
    post_id: number;
    score: number;
}

export type PostVoteT = {
    id: number;
    created_at: Date;
    updated_at?: Date | undefined;
    user_id: number;
    post_id: number;
    score: number;
}
