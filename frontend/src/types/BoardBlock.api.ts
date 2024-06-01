import { BoardBlockT, BoardBlockFormT } from "./BoardBlock";

// (POST) /
export type CreateRqs = {form: BoardBlockFormT}
export type CreateRsp = BoardBlockT

// (DELETE) /:id
export type DeleteRqs = null
export type DeleteRsp = BoardBlockT
