import type { ListPointReportOptionT, PointReportT } from "./PointReport";

// (GET) /
export type ListRqs = ListPointReportOptionT
export type ListRsp = ListData<PointReportT>

// (POST) /process
export type ProcessRqs = {date: string}
export type ProcessRsp = boolean

// (PATCH) /check/:id
export type CheckRqs = null
export type CheckRsp = PointReportT

// (PUT) /check-all
export type CheckAllRqs = null
export type CheckAllRsp = boolean