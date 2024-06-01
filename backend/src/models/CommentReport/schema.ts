import { z } from "zod";
import { baseModelSchema, insertFormSchema, getOptionSchema, reportFilterEnum } from "../$commons/schema";
import { TG } from "@/utils/type_generator";


const commentReportFormZ = {
  comment_id: z.number().int(),
  user_id: z.number().int().nullable(),

  category: z.string().nullish(),
  reason: z.string().nullish(),

  ignored_at: z.coerce.date().nullish(),
  resolved_at: z.coerce.date().nullish(),
};

export const commentReportFormSchema = insertFormSchema.extend(commentReportFormZ);

export const commentReportSchema = baseModelSchema.extend(commentReportFormZ);

export const getCommentReportOptionSchema = getOptionSchema.extend({
}).partial();
export const listCommentReportOptionSchema = getCommentReportOptionSchema.extend({
  limit: z.coerce.number().int().positive(),
  cursor: z.string(),
  status: reportFilterEnum,
  commentId: z.coerce.number().int(),
}).partial();


const tgKey = "CommentReport";

TG.add(tgKey, "CommentReportFormT", commentReportFormSchema);
TG.add(tgKey, "_CommentReportT", commentReportSchema, { private: true });

TG.add(tgKey, "GetCommentReportOptionT", getCommentReportOptionSchema);
TG.add(tgKey, "ListCommentReportOptionT", listCommentReportOptionSchema);
