export type PostBookmarkFormT = {
    user_id: number;
    post_id: number;
}

export type PostBookmarkT = {
    id: number;
    created_at: Date;
    updated_at?: Date | undefined;
    user_id: number;
    post_id: number;
}

export type GetPostBookmarkOptionT = {
    userId?: number | undefined;
    groupId?: number | undefined;
}

export type ListPostBookmarkOptionT = {
    userId?: number | undefined;
    groupId?: number | undefined;
}
