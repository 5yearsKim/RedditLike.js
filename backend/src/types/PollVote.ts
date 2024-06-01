export type PollVoteFormT = {
    user_id: number;
    cand_id: number;
}

export type PollVoteT = {
    id: number;
    created_at: Date;
    updated_at?: Date | undefined;
    user_id: number;
    cand_id: number;
}

export type GetPollVoteOptionT = {
    userId?: number | undefined;
    groupId?: number | undefined;
}

export type ListPollVoteOptionT = {
    userId?: number | undefined;
    groupId?: number | undefined;
}
