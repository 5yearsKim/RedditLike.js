import { z } from "zod";
import { baseModelSchema, insertFormSchema, getOptionSchema } from "../$commons/schema";
import { TG } from "@/utils/type_generator";


const pointDailyQuotaFormZ = {
  report_date: z.string(),
  point_quota: z.number(),

  check_point: z.number(),
  comment_point: z.number(),
  score_point: z.number(),
  trash_point: z.number(),
};

export const pointDailyQuotaFormSchema = insertFormSchema.extend(pointDailyQuotaFormZ);

export const pointDailyQuotaSchema = baseModelSchema.extend(pointDailyQuotaFormZ);

export const getPointDailyQuotaOptionSchema = getOptionSchema.extend({
}).partial();
export const listPointDailyQuotaOptionSchema = getPointDailyQuotaOptionSchema.extend({
}).partial();


const tgKey = "PointDailyQuota";

TG.add(tgKey, "PointDailyQuotaFormT", pointDailyQuotaFormSchema);
TG.add(tgKey, "PointDailyQuotaT", pointDailyQuotaSchema);

TG.add(tgKey, "GetPointDailyQuotaOptionT", getPointDailyQuotaOptionSchema);
TG.add(tgKey, "ListPointDailyQuotaOptionT", listPointDailyQuotaOptionSchema);

