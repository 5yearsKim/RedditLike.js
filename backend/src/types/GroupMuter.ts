export type GroupMuterFormT = {
    group_id: number;
    user_id: number;
    until: Date | null;
    reason: string | null;
}

export type GroupMuterT = {
    id: number;
    created_at: Date;
    updated_at?: Date | undefined;
    group_id: number;
    user_id: number;
    until: Date | null;
    reason: string | null;
}

export type GetGroupMuterOptionT = {
    userId?: (number | undefined) | undefined;
    groupId?: (number | undefined) | undefined;
}

export type ListGroupMuterOptionT = {
    userId?: ((number | undefined) | undefined) | undefined;
    groupId?: ((number | undefined) | undefined) | undefined;
    limit?: number | undefined;
    cursor?: string | undefined;
    sort?: ("recent" | "old") | undefined;
}
