import { z } from "zod";
import { baseModelSchema, insertFormSchema, getOptionSchema } from "../$commons/schema";
import { TG } from "@/utils/type_generator";


const groupMuterFormZ = {
  group_id: z.number().int(),
  user_id: z.number().int(),
  until: z.coerce.date().nullable(),
  reason: z.string().max(255).nullable(),
};

export const groupMuterFormSchema = insertFormSchema.extend(groupMuterFormZ);
export const groupMuterSchema = baseModelSchema.extend(groupMuterFormZ);

export const getGroupMuterOptionSchema = getOptionSchema.extend({}).partial();
export const listGroupMuterOptionSchema = getGroupMuterOptionSchema.extend({
  limit: z.coerce.number().int(),
  cursor: z.string(),
  sort: z.enum(["recent", "old"]),
}).partial();


const tgKey = "GroupMuter";

TG.add(tgKey, "GroupMuterFormT", groupMuterFormSchema);
TG.add(tgKey, "GroupMuterT", groupMuterSchema);

TG.add(tgKey, "GetGroupMuterOptionT", getGroupMuterOptionSchema);
TG.add(tgKey, "ListGroupMuterOptionT", listGroupMuterOptionSchema);

