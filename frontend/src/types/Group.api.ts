import type { GroupT, GroupFormT, GetGroupOptionT, ListGroupOptionT } from "./Group";

// (POST) /
export type CreateRqs = {form: GroupFormT}
export type CreateRsp = GroupT

// (GET) /key/:key
export type GetByKeyRqs = GetGroupOptionT
export type GetByKeyRsp = GetData<GroupT>

// (GET) /:id
export type GetRqs = GetGroupOptionT
export type GetRsp = GetData<GroupT>

// (GET) /
export type ListRqs = ListGroupOptionT
export type ListRsp = ListData<GroupT>

// (PATCH) /:id
export type UpdateRqs = {form: Partial<GroupFormT>}
export type UpdateRsp = GroupT

// (POST) /avatar/presigned-url
export type AvatarPresignedUrlRqs = {groupId: idT, mimeType: string}
export type AvatarPresignedUrlRsp = {putUrl: string, key: string}
