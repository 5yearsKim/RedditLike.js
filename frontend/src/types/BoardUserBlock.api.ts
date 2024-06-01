import {
  BoardUserBlockFormT, BoardUserBlockT,
  ListBoardUserBlockOptionT,
} from "./BoardUserBlock";


// (GET) /
export type ListRqs = ListBoardUserBlockOptionT
export type ListRsp = ListData<BoardUserBlockT>

// (POST) /
export type CreateRqs = {form: BoardUserBlockFormT}
export type CreateRsp = BoardUserBlockT

// (DELETE) /:id
export type DeleteRqs = null
export type DeleteRsp = BoardUserBlockT


