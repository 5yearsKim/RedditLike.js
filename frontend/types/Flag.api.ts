import { FlagFormT, FlagT, ListFlagOptionT } from "./Flag";

// (POST) /
export type CreateRqs = {form: FlagFormT}
export type CreateRsp = FlagT

// (GET) /
export type ListRqs = ListFlagOptionT
export type ListRsp = ListData<FlagT>

// (DELETE) /:id
export type DeleteRqs = null
export type DeleteRsp = FlagT

// (PATCH) /:id
export type UpdateRqs = {form: Partial<FlagFormT>}
export type UpdateRsp = FlagT
