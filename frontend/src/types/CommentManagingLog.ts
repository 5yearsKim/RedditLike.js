export type CommentManagingLogFormT = {
    board_id: number;
    user_id: number;
    comment_id: number;
    type: "approve" | "trash" | "rewrite";
    managed_by: ("admin" | "board") | null;
    memo: string | null;
}

type _CommentManagingLogT = {
    id: number;
    created_at: Date;
    updated_at?: Date | undefined;
    board_id: number;
    user_id: number;
    comment_id: number;
    type: "approve" | "trash" | "rewrite";
    managed_by: ("admin" | "board") | null;
    memo: string | null;
}

export type GetCommentManagingLogOptionT = {
    userId?: (number | undefined) | undefined;
    groupId?: (number | undefined) | undefined;
    $author?: boolean | undefined;
}

export type ListCommentManagingLogOptionT = {
    userId?: ((number | undefined) | undefined) | undefined;
    groupId?: ((number | undefined) | undefined) | undefined;
    $author?: (boolean | undefined) | undefined;
    commentId?: number | undefined;
}


// @type-gen remain
import type { AuthorT } from "./BoardUser";

export interface CommentManagingLogT extends _CommentManagingLogT {
  author?: AuthorT|null;
}