import { z } from "zod";
import { baseModelSchema, insertFormSchema, getOptionSchema } from "../$commons/schema";
import { TG } from "@/utils/type_generator";


const commentManagingLogFormZ = {
  board_id: z.number().int(),
  user_id: z.number().int(),
  comment_id: z.number().int(),
  type: z.enum(["approve", "trash", "rewrite"]),
  managed_by: z.enum(["admin", "board"]).nullable(),
  memo: z.string().nullable(),
};

export const commentManagingLogFormSchema = insertFormSchema.extend(commentManagingLogFormZ);

export const commentManagingLogSchema = baseModelSchema.extend(commentManagingLogFormZ);

export const getCommentManagingLogOptionSchema = getOptionSchema.extend({
  $author: z.coerce.boolean(),
}).partial();
export const listCommentManagingLogOptionSchema = getCommentManagingLogOptionSchema.extend({
  commentId: z.coerce.number().int(),
}).partial();


const tgKey = "CommentManagingLog";

TG.add(tgKey, "CommentManagingLogFormT", commentManagingLogFormSchema);
TG.add(tgKey, "_CommentManagingLogT", commentManagingLogSchema, { private: true });

TG.add(tgKey, "GetCommentManagingLogOptionT", getCommentManagingLogOptionSchema);
TG.add(tgKey, "ListCommentManagingLogOptionT", listCommentManagingLogOptionSchema);

