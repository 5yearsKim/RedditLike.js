export type FlairFormT = {
    box_id: number;
    label: string;
    text_color?: (string | null) | undefined;
    bg_color?: (string | null) | undefined;
    rank?: (number | null) | undefined;
    creator_id?: (number | null) | undefined;
    manager_only?: boolean | undefined;
}

export type FlairT = {
    id: number;
    created_at: Date;
    updated_at?: Date | undefined;
    box_id: number;
    label: string;
    text_color?: (string | null) | undefined;
    bg_color?: (string | null) | undefined;
    rank?: (number | null) | undefined;
    creator_id?: (number | null) | undefined;
    manager_only?: boolean | undefined;
}

export type GetFlairOptionT = {
    userId?: number | undefined;
}

export type ListFlairOptionT = {
    userId?: number | undefined;
}
