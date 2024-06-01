import { z } from "zod";
import { baseModelSchema, insertFormSchema, getOptionSchema } from "../$commons/schema";
import { TG } from "@/utils/type_generator";


const groupAdminFormZ = {
  user_id: z.number().int(),
  group_id: z.number().int(),

  // optional with default
  is_super: z.boolean().optional(),
  manage_admin: z.boolean().optional(),
  manage_member: z.boolean().optional(),
  manage_censor: z.boolean().optional(),
  manage_intro: z.boolean().optional(),
  manage_category: z.boolean().optional(),
  manage_muter: z.boolean().optional(),
};

export const groupAdminFormSchema = insertFormSchema.extend(groupAdminFormZ);
export const groupAdminSchema = baseModelSchema.extend({
  ...groupAdminFormZ,

  // optional with default
  is_super: z.boolean(),
  manage_admin: z.boolean(),
  manage_member: z.boolean(),
  manage_censor: z.boolean(),
  manage_intro: z.boolean(),
  manage_category: z.boolean(),
  manage_muter: z.boolean(),
});

export const getGroupAdminOptionSchema = getOptionSchema.extend({
  $user: z.coerce.boolean(),
  $account: z.coerce.boolean(),
}).partial();
export const listGroupAdminOptionSchema = getGroupAdminOptionSchema.extend({}).partial();


const tgKey = "GroupAdmin";

TG.add(tgKey, "GroupAdminFormT", groupAdminFormSchema);
TG.add(tgKey, "_GroupAdminT", groupAdminSchema, { private: true });

TG.add(tgKey, "GetGroupAdminOptionT", getGroupAdminOptionSchema);
TG.add(tgKey, "ListGroupAdminOptionT", listGroupAdminOptionSchema);

