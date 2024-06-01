import type {
  GroupAdminFormT, GroupAdminT,
  ListGroupAdminOptionT,
} from "./GroupAdmin";


// (POST) /
export type CreateRqs = {form: GroupAdminFormT}
export type CreateRsp = GroupAdminT

// (GET) /
export type ListRqs = ListGroupAdminOptionT
export type ListRsp = ListData<GroupAdminT>

// (GET) /me
export type GetMeRqs = {groupId: idT}
export type GetMeRsp = GetData<GroupAdminT|null>

// (PATCH) /:id
export type UpdateRqs = {form: Partial<GroupAdminFormT>}
export type UpdateRsp = GroupAdminT

// (DELETE) /:id
export type DeleteRqs = null
export type DeleteRsp = GroupAdminT

// (POST) /by-email
export type CreateByEmailRqs = {email: string, groupId: idT}
export type CreateByEmailRsp = GroupAdminT