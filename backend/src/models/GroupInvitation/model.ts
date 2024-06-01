import { DataModel } from "@/utils/orm";
import type { GroupInvitationFormT, GroupInvitationT } from "@/types/GroupInvitation";


const table = "group_invitations";
export const groupInvitationM = new DataModel<GroupInvitationFormT, GroupInvitationT>(table);


