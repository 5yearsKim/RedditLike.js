import type { FlairBoxFormT, FlairBoxT, GetFlairBoxOptionT, ListFlairBoxOptionT } from "./FlairBox";

// (POST) /
export type CreateRqs = {form: FlairBoxFormT}
export type CreateRsp = FlairBoxT

// (GET) /
export type ListRqs = ListFlairBoxOptionT
export type ListRsp = ListData<FlairBoxT>


// (GET) /:id
export type GetRqs = GetFlairBoxOptionT
export type GetRsp = GetData<FlairBoxT>

// (PATCH) /:id
export type UpdateRqs = {form: Partial<FlairBoxFormT>}
export type UpdateRsp = FlairBoxT

// (DELETE) /:id
export type DeleteRqs = null
export type DeleteRsp = FlairBoxT
