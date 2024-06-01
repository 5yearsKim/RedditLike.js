import { z } from "zod";
import { baseModelSchema, insertFormSchema, getOptionSchema, reportFilterEnum } from "../$commons/schema";
import { TG } from "@/utils/type_generator";


const postReportFormZ = {
  post_id: z.number().int(),
  user_id: z.number().int().nullable(),

  category: z.string().min(1).max(32).nullish(),
  reason: z.string().min(1).max(255).nullish(),

  ignored_at: z.coerce.date().nullish(),
  resolved_at: z.coerce.date().nullish(),
};

export const postReportFormSchema = insertFormSchema.extend(postReportFormZ);
export const postReportSchema = baseModelSchema.extend(postReportFormZ);

export const getPostReportOptionSchema = getOptionSchema.extend({
}).partial();
export const listPostReportOptionSchema = getPostReportOptionSchema.extend({
  limit: z.coerce.number().int().positive(),
  cursor: z.string(),
  status: reportFilterEnum,
  postId: z.coerce.number().int(),
}).partial();


const tgKey = "PostReport";

TG.add(tgKey, "PostReportFormT", postReportFormSchema);
TG.add(tgKey, "_PostReportT", postReportSchema, { private: true });

TG.add(tgKey, "GetPostReportOptionT", getPostReportOptionSchema);
TG.add(tgKey, "ListPostReportOptionT", listPostReportOptionSchema);