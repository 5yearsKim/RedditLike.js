import { z } from "zod";
import { TG } from "@/utils/type_generator";


const tgKey = "$commons";

export const insertFormSchema = z.object({});
TG.add(tgKey, "InsertFormT", insertFormSchema);

export const baseModelSchema = z.object({
  id: z.number().int(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date().optional(),
});
TG.add(tgKey, "BaseModelT", baseModelSchema);

export const getOptionSchema = z.object({
  userId: z.coerce.number().int(),
  groupId: z.coerce.number().int(),
}).partial();
TG.add(tgKey, "GetOptionT", getOptionSchema);


// app
export const censorFilterEnum = z.enum(["approved", "trashed","exceptTrashed", "exceptProcessed"]);
TG.add(tgKey, "CensorFilterT", censorFilterEnum);

export const reportFilterEnum = z.enum(["all", "resolved", "ignored", "unprocessed"]);
TG.add(tgKey, "ReportFilterT", reportFilterEnum);