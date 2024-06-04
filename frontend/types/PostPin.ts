export type PostPinFormT = {
    board_id: number;
    post_id: number;
    rank?: (number | null) | undefined;
}

export type PostPinT = {
    id: number;
    created_at: Date;
    updated_at?: Date | undefined;
    board_id: number;
    post_id: number;
    rank?: (number | null) | undefined;
}
