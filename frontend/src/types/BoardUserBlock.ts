export type BoardUserBlockFormT = {
    board_id: number;
    from_id: number;
    target_id: number;
}

type _BoardUserBlockT = {
    id: number;
    created_at: Date;
    updated_at?: Date | undefined;
    board_id: number;
    from_id: number;
    target_id: number;
}

export type GetBoardUserBlockOptionT = {
    userId?: (number | undefined) | undefined;
    groupId?: (number | undefined) | undefined;
    $board?: boolean | undefined;
    $target?: boolean | undefined;
}

export type ListBoardUserBlockOptionT = {
    userId?: ((number | undefined) | undefined) | undefined;
    groupId?: ((number | undefined) | undefined) | undefined;
    $board?: (boolean | undefined) | undefined;
    $target?: (boolean | undefined) | undefined;
}


// @type-gen remain
import { BoardT } from "./Board";
import { AuthorT } from "./BoardUser";

export interface BoardUserBlockT extends _BoardUserBlockT {
  board?: BoardT
  target?: AuthorT|null
}