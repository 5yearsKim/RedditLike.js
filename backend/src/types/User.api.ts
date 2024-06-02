import type { UserT, UserFormT, ListUserOptionT, GetUserOptionT } from "./User";
import type { UserSessionT } from "./Auth";


// (POST) /
export type CreateRqs = {form: UserFormT}
export type CreateRsp = UserT

// (GET) /
export type ListRqs = ListUserOptionT
export type ListRsp = ListData<UserT>

// (PATCH) /me
export type UpdateMeRqs = {form: Partial<UserFormT>}
export type UpdateMeRsp = UserT

// (GET) /me
export type GetMeRqs = GetUserOptionT
export type GetMeRsp = GetData<UserT>

// (DELETE) /me
export type DeleteMeRqs = null
export type DeleteMeRsp = UserT

// (POST) /access
export type AccessRqs = {token: string}
export type AccessRsp = {session: UserSessionT|null}
