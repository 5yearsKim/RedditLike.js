import { BoardManagerT, BoardManagerFormT, GetBoardManagerOptionT, ListBoardManagerOptionT } from "./BoardManager";

// (POST) /
export type CreateRqs = {form: BoardManagerFormT}
export type CreateRsp = BoardManagerT

// (PATCH) /:id
export type UpdateRqs = {form: Partial<BoardManagerFormT>}
export type UpdateRsp = BoardManagerT

// (DELETE) /:id
export type DeleteRqs = null
export type DeleteRsp = BoardManagerT

// (GET) /:id
export type GetRqs = GetBoardManagerOptionT;
export type GetRsp = GetData<BoardManagerT>

// (GET) /
export type ListRqs = ListBoardManagerOptionT
export type ListRsp = ListData<BoardManagerT>

// (GET) /boards/:boardId/me
export type GetMeRqs = null
export type GetMeRsp = GetData<BoardManagerT|null>
