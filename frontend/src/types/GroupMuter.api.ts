import {
  GroupMuterFormT, GroupMuterT, ListGroupMuterOptionT,
} from "./GroupMuter";


// (POST) /
export type CreateRqs = {form: GroupMuterFormT}
export type CreateRsp = GroupMuterT

// (GET) /
export type ListRqs = ListGroupMuterOptionT
export type ListRsp = ListData<GroupMuterT>

// (GET) /me
export type GetMeRqs = {groupId: idT}
export type GetMeRsp = GetData<GroupMuterT|null>

// (DELETE) /:id
export type DeleteRqs = null
export type DeleteRsp = GroupMuterT