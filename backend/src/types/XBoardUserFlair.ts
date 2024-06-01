export type XBoardUserFlairFormT = {
    flair_id: number;
    board_user_id: number;
    rank?: (number | null) | undefined;
}

export type XBoardUserFlairT = {
    id: number;
    created_at: Date;
    updated_at?: Date | undefined;
    flair_id: number;
    board_user_id: number;
    rank?: (number | null) | undefined;
}
