export type MuterFormT = {
    user_id: number;
    until: Date | null;
    reason: string | null;
}

export type MuterT = {
    id: number;
    created_at: Date;
    updated_at?: Date | undefined;
    user_id: number;
    until: Date | null;
    reason: string | null;
}

export type GetMuterOptionT = {
    userId?: (number | undefined) | undefined;
}

export type ListMuterOptionT = {
    userId?: ((number | undefined) | undefined) | undefined;
    limit?: number | undefined;
    cursor?: string | undefined;
    sort?: ("recent" | "old") | undefined;
}
