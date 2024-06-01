import type { GroupInvitationT, InviteStatusT, ListGroupInvitationOptionT } from "./GroupInvitation";

// (GET) /
export type ListRqs = ListGroupInvitationOptionT;
export type ListRsp = ListData<GroupInvitationT>;

// (POST) /invite
export type InviteRqs = {groupId: idT, email: string};
export type InviteRsp = {status: InviteStatusT, invitation: GroupInvitationT|null}

// (DELETE) /:id
export type DeleteRqs = null;
export type DeleteRsp = GroupInvitationT;