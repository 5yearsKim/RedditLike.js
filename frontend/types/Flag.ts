export type FlagFormT = {
    board_id: number;
    label: string;
    text_color?: (string | null) | undefined;
    bg_color?: (string | null) | undefined;
    description?: (string | null) | undefined;
    manager_only?: boolean | undefined;
}

export type FlagT = {
    id: number;
    created_at: Date;
    updated_at?: Date | undefined;
    board_id: number;
    label: string;
    text_color?: (string | null) | undefined;
    bg_color?: (string | null) | undefined;
    description?: (string | null) | undefined;
    manager_only: boolean;
}

export type GetFlagOptionT = {
    userId?: number | undefined;
}

export type ListFlagOptionT = {
    userId?: (number | undefined) | undefined;
    boardId?: number | undefined;
}
