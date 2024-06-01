import type { PointDailyQuotaT } from "./PointDailyQuota";

// (POST) /inspect-raw
export type InspectRawRqs = {
  upsert?: boolean
  date?: string|null

  trashPoint: number
  checkPoint: number
  scorePoint: number
  commentPoint: number
}
export type InspectRawRsp = PointDailyQuotaT


// (POST) /inspect
export type InspectRqs = {
  upsert?: boolean
  date?: string|null

  moneyC: number
  trashPoint: number
  checkW: number
  scoreW: number
  commentW: number
}
export type InspectRsp = PointDailyQuotaT