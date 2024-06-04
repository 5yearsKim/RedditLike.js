import type {
  AdminT, AdminFormT,
  ListAdminOptionT,
} from "./Admin";


// (POST) /
export type CreateRqs = {form: AdminFormT}
export type CreateRsp = AdminT

// (GET) /
export type ListRqs = ListAdminOptionT
export type ListRsp = ListData<AdminT>

// (GET) /me
export type GetMeRqs = null
export type GetMeRsp = GetData<AdminT|null>

// (PATCH) /:id
export type UpdateRqs = {form: Partial<AdminFormT>}
export type UpdateRsp = AdminT

// (DELETE) /:id
export type DeleteRqs = null
export type DeleteRsp = AdminT

// (POST) /by-email
export type CreateByEmailRqs = { email: string }
export type CreateByEmailRsp = AdminT