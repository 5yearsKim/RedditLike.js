import { z } from "zod";
import { baseModelSchema, insertFormSchema, getOptionSchema } from "../$commons/schema";
import { TG } from "@/utils/type_generator";

export const inviteStatusEnum = z.enum(["alreadyMember", "pending", "accepted", "declined"]);
export const GroupInvitationSortEnum = z.enum(["recent", "old"]);

const groupInvitationFormZ = {
  group_id: z.number().int(),
  email: z.string().email(),
  declined_at: z.date().nullish(),
};

export const groupInvitationFormSchema = insertFormSchema.extend(groupInvitationFormZ);
export const groupInvitationSchema = baseModelSchema.extend(groupInvitationFormZ);

export const getGroupInvitationOptionSchema = getOptionSchema.extend({});
export const listGroupInvitationOptionSchema = getGroupInvitationOptionSchema.extend({
  limit: z.coerce.number().int(),
  cursor: z.string(),
  sort: GroupInvitationSortEnum,
  groupId: z.coerce.number().int(),
  email: z.string(),
  declined: z.enum(["only", "except"]),
}).partial();


const tgKey = "GroupInvitation";

TG.add(tgKey, "InviteStatusT", inviteStatusEnum);

TG.add(tgKey, "GroupInvitationFormT", groupInvitationFormSchema);
TG.add(tgKey, "GroupInvitationT", groupInvitationSchema);

TG.add(tgKey, "GetGroupInvitationOptionT", getGroupInvitationOptionSchema);
TG.add(tgKey, "ListGroupInvitationOptionT", listGroupInvitationOptionSchema);


