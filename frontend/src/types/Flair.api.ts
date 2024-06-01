import { FlairFormT, FlairT } from "./Flair";


// (POST) /
export type CreateRqs = {form: FlairFormT}
export type CreateRsp = FlairT

// (PATCH) /:id
export type UpdateRqs = {form: Partial<FlairFormT>}
export type UpdateRsp = FlairT

// (DELETE) /:id
export type DeleteRqs = null
export type DeleteRsp = FlairT

// (PUT) /rerank
export type RerankRqs = {boxId: idT, flairIds: idT[]}
export type RerankRsp = FlairT[]

// (POST) /custom
export type CreateCustomRqs = {form: FlairFormT}
export type CreateCustomRsp = FlairT

// (DELETE) /custom/:id
export type DeleteCustomRqs = null
export type DeleteCustomRsp = FlairT
