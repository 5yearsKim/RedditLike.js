export type XBoardCategoryFormT = {
    category_id: number;
    board_id: number;
}

export type XBoardCategoryT = {
    id: number;
    created_at: Date;
    updated_at?: Date | undefined;
    category_id: number;
    board_id: number;
}
