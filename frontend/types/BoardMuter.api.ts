import { BoardMuterFormT, BoardMuterT, ListBoardMuterOptionT, GetBoardMuterOptionT } from "./BoardMuter";


// (POST) /
export type CreateRqs = {form: BoardMuterFormT}
export type CreateRsp = BoardMuterT

// (GET) /:id
export type GetRqs = GetBoardMuterOptionT
export type GetRsp = GetData<BoardMuterT>

// (PATCH) /:id
export type UpdateRqs = {form: Partial<BoardMuterFormT>}
export type UpdateRsp = BoardMuterT

// (DELETE) /:id
export type DeleteRqs = null
export type DeleteRsp = BoardMuterT

// (GET) /
export type ListRqs = ListBoardMuterOptionT
export type ListRsp = ListData<BoardMuterT>
