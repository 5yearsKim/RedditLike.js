import { z } from "zod";
import { baseModelSchema, insertFormSchema, getOptionSchema } from "../$commons/schema";
import { TG } from "@/utils/type_generator";


const postManagingLogFormZ = {
  board_id: z.number().int(),
  user_id: z.number().int(),
  post_id: z.number().int(),
  type: z.enum(["approve", "trash", "rewrite"]),
  managed_by: z.enum(["admin", "board"]).nullable(),
  memo: z.string().nullable(),
};

export const postManagingLogFormSchema = insertFormSchema.extend(postManagingLogFormZ);
export const postManagingLogSchema = baseModelSchema.extend(postManagingLogFormZ);

export const getPostManagingLogOptionSchema = getOptionSchema.extend({
  $author: z.coerce.boolean(),
}).partial();
export const listPostManagingLogOptionSchema = getPostManagingLogOptionSchema.extend({
  postId: z.coerce.number().int(),
}).partial();


const tgKey = "PostManagingLog";

TG.add(tgKey, "PostManagingLogFormT", postManagingLogFormSchema);
TG.add(tgKey, "_PostManagingLogT", postManagingLogSchema, { private: true });

TG.add(tgKey, "GetPostManagingLogOptionT", getPostManagingLogOptionSchema);
TG.add(tgKey, "ListPostManagingLogOptionT", listPostManagingLogOptionSchema);

