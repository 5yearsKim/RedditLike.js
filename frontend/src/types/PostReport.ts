export type PostReportFormT = {
    post_id: number;
    user_id: number | null;
    category?: (string | null) | undefined;
    reason?: (string | null) | undefined;
    ignored_at?: (Date | null) | undefined;
    resolved_at?: (Date | null) | undefined;
}

type _PostReportT = {
    id: number;
    created_at: Date;
    updated_at?: Date | undefined;
    post_id: number;
    user_id: number | null;
    category?: (string | null) | undefined;
    reason?: (string | null) | undefined;
    ignored_at?: (Date | null) | undefined;
    resolved_at?: (Date | null) | undefined;
}

export type GetPostReportOptionT = {
    userId?: (number | undefined) | undefined;
    groupId?: (number | undefined) | undefined;
}

export type ListPostReportOptionT = {
    userId?: ((number | undefined) | undefined) | undefined;
    groupId?: ((number | undefined) | undefined) | undefined;
    limit?: number | undefined;
    cursor?: string | undefined;
    status?: ("all" | "resolved" | "ignored" | "unprocessed") | undefined;
    postId?: number | undefined;
}


// @type-gen remain
export interface PostReportT extends _PostReportT {}