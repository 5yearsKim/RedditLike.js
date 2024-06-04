import { BoardRuleFormT, BoardRuleT, ListBoardRuleOptionT } from "./BoardRule";


// (POST) /
export type CreateRqs = {form: BoardRuleFormT}
export type CreateRsp = BoardRuleT


// (PATCH) /:id
export type UpdateRqs = {form: Partial<BoardRuleFormT>}
export type UpdateRsp = BoardRuleT

// (DELETE) /:id
export type DeleteRqs = null
export type DeleteRsp = BoardRuleT

// (GET) /
export type ListRqs = ListBoardRuleOptionT
export type ListRsp = ListData<BoardRuleT>

// (PUT) /rerank
export type RerankRqs = {boardId: idT, ruleIds: idT[]}
export type RerankRsp = BoardRuleT[]


