export type PostManagingLogFormT = {
    board_id: number;
    user_id: number;
    post_id: number;
    type: "approve" | "trash" | "rewrite";
    managed_by: ("admin" | "board") | null;
    memo: string | null;
}

type _PostManagingLogT = {
    id: number;
    created_at: Date;
    updated_at?: Date | undefined;
    board_id: number;
    user_id: number;
    post_id: number;
    type: "approve" | "trash" | "rewrite";
    managed_by: ("admin" | "board") | null;
    memo: string | null;
}

export type GetPostManagingLogOptionT = {
    userId?: (number | undefined) | undefined;
    $author?: boolean | undefined;
}

export type ListPostManagingLogOptionT = {
    userId?: ((number | undefined) | undefined) | undefined;
    $author?: (boolean | undefined) | undefined;
    postId?: number | undefined;
}


// @type-gen remain
import type { AuthorT } from "./BoardUser";

export interface PostManagingLogT extends _PostManagingLogT{
  author?: AuthorT|null;
}