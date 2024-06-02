import { z } from "zod";
import { baseModelSchema, insertFormSchema, getOptionSchema } from "../$commons/schema";
import { TG } from "@/utils/type_generator";


export const adminFormSchema = insertFormSchema.extend({
  user_id: z.number().int(),

  // optional with default
  is_super: z.boolean().optional(),
  manage_admin: z.boolean().optional(),
  manage_member: z.boolean().optional(),
  manage_censor: z.boolean().optional(),
  manage_intro: z.boolean().optional(),
  manage_category: z.boolean().optional(),
  manage_muter: z.boolean().optional(),
});
export const adminSchema = baseModelSchema.extend({
  ...adminFormSchema.shape,

  // optional with default
  is_super: z.boolean(),
  manage_admin: z.boolean(),
  manage_member: z.boolean(),
  manage_censor: z.boolean(),
  manage_intro: z.boolean(),
  manage_category: z.boolean(),
  manage_muter: z.boolean(),
});

export const getAdminOptionSchema = getOptionSchema.extend({
  $user: z.coerce.boolean(),
}).partial();
export const listAdminOptionSchema = getAdminOptionSchema.extend({
}).partial();


const tgKey = "Admin";

TG.add(tgKey, "AdminFormT", adminFormSchema);
TG.add(tgKey, "_AdminT", adminSchema, { private: true });

TG.add(tgKey, "GetAdminOptionT", getAdminOptionSchema);
TG.add(tgKey, "ListAdminOptionT", listAdminOptionSchema);

