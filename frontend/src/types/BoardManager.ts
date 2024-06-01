export type BoardManagerFormT = {
    user_id: number;
    board_id: number;
    is_super?: boolean | undefined;
    manage_censor?: boolean | undefined;
    manage_manager?: boolean | undefined;
    manage_muter?: boolean | undefined;
    manage_write?: boolean | undefined;
    manage_intro?: boolean | undefined;
    manage_info?: boolean | undefined;
    manage_exposure?: boolean | undefined;
    manage_contents?: boolean | undefined;
    manage_etc?: boolean | undefined;
}

type _BoardManagerT = {
    id: number;
    created_at: Date;
    updated_at?: Date | undefined;
    user_id: number;
    board_id: number;
    is_super: boolean;
    manage_censor: boolean;
    manage_manager: boolean;
    manage_muter: boolean;
    manage_write: boolean;
    manage_intro: boolean;
    manage_info: boolean;
    manage_exposure: boolean;
    manage_contents: boolean;
    manage_etc: boolean;
}

export type GetBoardManagerOptionT = {
    userId?: (number | undefined) | undefined;
    groupId?: (number | undefined) | undefined;
    $author?: boolean | undefined;
}

export type ListBoardManagerOptionT = {
    userId?: ((number | undefined) | undefined) | undefined;
    groupId?: ((number | undefined) | undefined) | undefined;
    $author?: (boolean | undefined) | undefined;
    boardId?: number | undefined;
}


// @type-gen remain
import { AuthorT } from "./BoardUser";

export interface BoardManagerT extends _BoardManagerT {
  author?: AuthorT | null
}