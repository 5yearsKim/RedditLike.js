export type CommentSortT = "old" | "recent" | "vote" | "discussed"

export type CommentFormT = {
    author_id: number | null;
    post_id: number;
    body?: (string | null) | undefined;
    body_type: "html" | "md";
    path?: (string | null) | undefined;
    parent_id?: (number | null) | undefined;
    ignore_report?: boolean | undefined;
    published_at?: (Date | null) | undefined;
    rewrite_at?: (Date | null) | undefined;
    deleted_at?: (Date | null) | undefined;
    trashed_at?: (Date | null) | undefined;
    trashed_by?: (("manager" | "admin") | null) | undefined;
    approved_at?: (Date | null) | undefined;
    show_manager?: boolean | undefined;
    num_vote?: number | undefined;
    score?: number | undefined;
    num_children?: number | undefined;
}

type _CommentT = {
    id: number;
    created_at: Date;
    updated_at?: Date | undefined;
    author_id: number | null;
    post_id: number;
    body?: (string | null) | undefined;
    body_type: "html" | "md";
    path?: (string | null) | undefined;
    parent_id?: (number | null) | undefined;
    ignore_report: boolean;
    published_at?: (Date | null) | undefined;
    rewrite_at?: (Date | null) | undefined;
    deleted_at?: (Date | null) | undefined;
    trashed_at?: (Date | null) | undefined;
    trashed_by?: (("manager" | "admin") | null) | undefined;
    approved_at?: (Date | null) | undefined;
    show_manager?: boolean | undefined;
    num_vote: number;
    score: number;
    num_children: number;
}

export type GetCommentOptionT = {
    userId?: (number | undefined) | undefined;
    $defaults?: boolean | undefined;
    $user_defaults?: boolean | undefined;
    $manager_defaults?: boolean | undefined;
    $parent?: boolean | undefined;
    $post?: boolean | undefined;
    $author_idx?: boolean | undefined;
}

export type ListCommentOptionT = {
    userId?: ((number | undefined) | undefined) | undefined;
    $defaults?: (boolean | undefined) | undefined;
    $user_defaults?: (boolean | undefined) | undefined;
    $manager_defaults?: (boolean | undefined) | undefined;
    $parent?: (boolean | undefined) | undefined;
    $post?: (boolean | undefined) | undefined;
    $author_idx?: (boolean | undefined) | undefined;
    cursor?: string | undefined;
    limit?: number | undefined;
    sort?: ("old" | "recent" | "vote" | "discussed") | undefined;
    search?: string | undefined;
    postId?: number | undefined;
    boardId?: number | undefined;
    authorId?: number | undefined;
    rootPath?: (string | null) | undefined;
    report?: ("all" | "resolved" | "ignored" | "unprocessed") | undefined;
    censor?: ("approved" | "trashed" | "exceptTrashed" | "exceptProcessed") | undefined;
}


// @type-gen remain
import { AuthorT } from "./BoardUser";
import { PostT } from "./Post";
import { BoardT } from "./Board";
import { CommentReportT } from "./CommentReport";

export interface CommentT extends _CommentT {
  author?: AuthorT
  // user fields
  my_score?: number
  my_vote?: number
  // manager fields
  reports?: CommentReportT[]
  num_ignored_report?: number
  num_resolved_report?: number
  // lookup fields
  children?: CommentT[]
  post?: PostT
  board?: BoardT
  parent?: CommentT|null
  author_idx?: number
}