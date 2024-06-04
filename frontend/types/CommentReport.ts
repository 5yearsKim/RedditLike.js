export type CommentReportFormT = {
    comment_id: number;
    user_id: number | null;
    category?: (string | null) | undefined;
    reason?: (string | null) | undefined;
    ignored_at?: (Date | null) | undefined;
    resolved_at?: (Date | null) | undefined;
}

type _CommentReportT = {
    id: number;
    created_at: Date;
    updated_at?: Date | undefined;
    comment_id: number;
    user_id: number | null;
    category?: (string | null) | undefined;
    reason?: (string | null) | undefined;
    ignored_at?: (Date | null) | undefined;
    resolved_at?: (Date | null) | undefined;
}

export type GetCommentReportOptionT = {
    userId?: (number | undefined) | undefined;
}

export type ListCommentReportOptionT = {
    userId?: ((number | undefined) | undefined) | undefined;
    limit?: number | undefined;
    cursor?: string | undefined;
    status?: ("all" | "resolved" | "ignored" | "unprocessed") | undefined;
    commentId?: number | undefined;
}


// @type-gen remain
export interface CommentReportT extends _CommentReportT {
}