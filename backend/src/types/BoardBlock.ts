export type BoardBlockFormT = {
    board_id: number;
    user_id: number;
}

export type BoardBlockT = {
    id: number;
    created_at: Date;
    updated_at?: Date | undefined;
    board_id: number;
    user_id: number;
}
