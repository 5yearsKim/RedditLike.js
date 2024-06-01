export type PostFormT = {
    author_id: number | null;
    board_id: number;
    title: string;
    body?: (string | null) | undefined;
    body_type: "md" | "html";
    is_nsfw?: boolean | undefined;
    is_spoiler?: boolean | undefined;
    ignore_report?: boolean | undefined;
    published_at?: (Date | null) | undefined;
    rewrite_at?: (Date | null) | undefined;
    deleted_at?: (Date | null) | undefined;
    trashed_at?: (Date | null) | undefined;
    trashed_by?: (("manager" | "admin") | null) | undefined;
    approved_at?: (Date | null) | undefined;
    reserved_at?: (Date | null) | undefined;
    show_manager?: boolean | undefined;
    content_source?: (string | null) | undefined;
    thumb_path?: (string | null) | undefined;
    hot_score?: number | undefined;
    num_vote?: number | undefined;
    score?: number | undefined;
    num_comment?: number | undefined;
}

type _PostT = {
    id: number;
    created_at: Date;
    updated_at?: Date | undefined;
    author_id: number | null;
    board_id: number;
    title: string;
    body?: (string | null) | undefined;
    body_type: "md" | "html";
    is_nsfw: boolean;
    is_spoiler: boolean;
    ignore_report: boolean;
    published_at?: (Date | null) | undefined;
    rewrite_at?: (Date | null) | undefined;
    deleted_at?: (Date | null) | undefined;
    trashed_at?: (Date | null) | undefined;
    trashed_by?: (("manager" | "admin") | null) | undefined;
    approved_at?: (Date | null) | undefined;
    reserved_at?: (Date | null) | undefined;
    show_manager: boolean;
    content_source?: (string | null) | undefined;
    thumb_path?: (string | null) | undefined;
    hot_score: number;
    num_vote: number;
    score: number;
    num_comment: number;
}

export type PostSortT = "recent" | "hot" | "vote" | "discussed"

export type GetPostOptionT = {
    userId?: (number | undefined) | undefined;
    groupId?: (number | undefined) | undefined;
    $defaults?: boolean | undefined;
    $user_defaults?: boolean | undefined;
    $manager_defaults?: boolean | undefined;
    $board?: boolean | undefined;
    $pin?: boolean | undefined;
}

export type ListPostOptionT = {
    userId?: ((number | undefined) | undefined) | undefined;
    groupId?: ((number | undefined) | undefined) | undefined;
    $defaults?: (boolean | undefined) | undefined;
    $user_defaults?: (boolean | undefined) | undefined;
    $manager_defaults?: (boolean | undefined) | undefined;
    $board?: (boolean | undefined) | undefined;
    $pin?: (boolean | undefined) | undefined;
    sort?: ("recent" | "hot" | "vote" | "discussed") | undefined;
    limit?: number | undefined;
    cursor?: string | undefined;
    boardId?: number | undefined;
    authorId?: number | undefined;
    search?: string | undefined;
    pin?: ("only" | "except") | undefined;
    following?: ("only" | "except") | undefined;
    block?: ("only" | "except") | undefined;
    bookmark?: ("only" | "except") | undefined;
    published?: ("only" | "except") | undefined;
    censor?: ("approved" | "trashed" | "exceptTrashed" | "exceptProcessed") | undefined;
    boardCensor?: ("trashed" | "exceptTrashed" | "all") | undefined;
    flagId?: number | undefined;
    report?: ("all" | "resolved" | "ignored" | "unprocessed") | undefined;
    fromAt?: Date | undefined;
}


// @type-gen remain
import type { BoardT } from "./Board";
import type { AuthorT } from "./BoardUser";
import type { FlagT } from "./Flag";
import type { PostReportT } from "./PostReport";
import type { ImageT } from "./Image";
import type { VideoT } from "./Video";
// import { BoardFollowerT } from "./BoardFollower";
import type { PostPinT } from "./PostPin";
import type { PostCheckT } from "./PostCheck";
import type { PostBookmarkT } from "./PostBookmark";

export interface PostT extends _PostT {
  author?: AuthorT|null
  num_check?: number
  flags?: FlagT[]
  images?: ImageT[]
  videos?: VideoT[]
  // users
  my_score?: number|null
  check?: PostCheckT|null
  bookmark?: PostBookmarkT|null
  // managers
  reports?: PostReportT[]
  num_ignored_report?: number
  num_resolved_report?: number
  // optional
  board?: BoardT
  pin?: PostPinT|null
}