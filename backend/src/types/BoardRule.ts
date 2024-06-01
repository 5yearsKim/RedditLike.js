export type BoardRuleRangeT = "all" | "post" | "comment"

export type BoardRuleFormT = {
    board_id: number;
    title: string;
    alias?: (string | null) | undefined;
    range: "all" | "post" | "comment";
    description: string;
    rank?: (number | null) | undefined;
}

export type BoardRuleT = {
    id: number;
    created_at: Date;
    updated_at?: Date | undefined;
    board_id: number;
    title: string;
    alias?: (string | null) | undefined;
    range: "all" | "post" | "comment";
    description: string;
    rank?: (number | null) | undefined;
}

export type GetBoardRuleOptionT = {
    userId?: number | undefined;
    groupId?: number | undefined;
}

export type ListBoardRuleOptionT = {
    userId?: (number | undefined) | undefined;
    groupId?: (number | undefined) | undefined;
    boardId?: number | undefined;
}
