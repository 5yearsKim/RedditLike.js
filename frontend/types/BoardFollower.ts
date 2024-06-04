export type BoardFollowerFormT = {
    user_id: number;
    board_id: number;
}

export type BoardFollowerT = {
    id: number;
    created_at: Date;
    updated_at?: Date | undefined;
    user_id: number;
    board_id: number;
}
