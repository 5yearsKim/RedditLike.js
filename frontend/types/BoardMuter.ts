export type BoardMuterFormT = {
    board_id: number;
    user_id: number;
    until?: (Date | null) | undefined;
    reason?: (string | null) | undefined;
}

type _BoardMuterT = {
    id: number;
    created_at: Date;
    updated_at?: Date | undefined;
    board_id: number;
    user_id: number;
    until?: (Date | null) | undefined;
    reason?: (string | null) | undefined;
}

export type GetBoardMuterOptionT = {
    userId?: number | undefined;
    $author?: boolean;
}

export type ListBoardMuterOptionT = {
    userId?: number | undefined;
    $author?: boolean;
    boardId: number;
}


// @type-gen remain
import type { AuthorT } from "./BoardUser";

export interface BoardMuterT extends _BoardMuterT {
  author?: AuthorT | undefined;
}