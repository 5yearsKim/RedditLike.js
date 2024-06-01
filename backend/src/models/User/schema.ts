import { z } from "zod";
import { baseModelSchema, insertFormSchema, getOptionSchema } from "../$commons/schema";
import { TG } from "@/utils/type_generator";

// user
const userFormZ = {
  account_id: z.number().int(),
  group_id: z.number().int(),
  deleted_at: z.coerce.date().nullish(),
  last_login_at: z.coerce.date().nullish(),

  points: z.number().int().optional(),
  // preference
  notify_comment_on_comment: z.boolean().optional(),
  notify_comment_on_post: z.boolean().optional(),
  notify_trash_post: z.boolean().optional(),
  notify_trash_comment: z.boolean().optional(),
  allow_chat_push: z.boolean().optional(),

};


export const userFormSchema = insertFormSchema.extend(userFormZ);
export const userSchema = baseModelSchema.extend({
  ...userFormZ,
  //default
  points: z.number().int(),
  notify_comment_on_comment: z.boolean(),
  notify_comment_on_post: z.boolean(),
  notify_trash_post: z.boolean(),
  notify_trash_comment: z.boolean(),
  allow_chat_push: z.boolean(),
});

export const userSortEnum = z.enum(["recent", "old"]);

export const getUserOptionSchema = getOptionSchema.extend({
  $account: z.coerce.boolean(),
}).partial();
export const listUserOptionSchema = getUserOptionSchema.extend({
  cursor: z.string(),
  limit: z.coerce.number().int().positive(),
  sort: userSortEnum,
  search: z.string(),
}).partial();


const tgKey = "User";

TG.add(tgKey, "UserFormT", userFormSchema);
TG.add(tgKey, "_UserT", userSchema, { private: true });

TG.add(tgKey, "GetUserOptionT", getUserOptionSchema);
TG.add(tgKey, "ListUserOptionT", listUserOptionSchema);


// utils

// export const groupJoinStatusEnum = z.enum(["joined", "not_joined", "need_approval"]);
// TG.add(tgKey, "GroupJoinStatusT", groupJoinStatusEnum);

export const userSessionSchema = z.object({
  user: userSchema,
  token: z.string(),
  tokenExpAt: z.number(),
});

TG.add(tgKey, "UserSessionT", userSessionSchema);
