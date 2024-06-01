import { DataModel } from "@/utils/orm";
import type { PointDailyQuotaFormT, PointDailyQuotaT } from "@/types/PointDailyQuota";


const table = "point_daily_quotas";
export const pointDailyQuotaM = new DataModel<PointDailyQuotaFormT, PointDailyQuotaT>(table);


