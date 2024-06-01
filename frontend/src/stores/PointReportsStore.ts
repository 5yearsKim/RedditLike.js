"use client";
import { atom } from "recoil";
import { useListDataStore, ListDataT } from "./molds/list_data";
import * as PointReportApi from "@/apis/point_reports";
import type { PointReportT, ListPointReportOptionT } from "@/types/PointReport";

const pointReportsState = atom<ListDataT<PointReportT, ListPointReportOptionT>>({
  key: "pointReportsState",
  default: {
    status: "init",
    data: [],
    listArg: {} as ListPointReportOptionT,
    appendingStatus: "init",
    nextCursor: null,
    lastUpdated: null,
  },
});

export function usePointReportsStore() {
  const { data: pointReports$, actions: pointReportsAct } = useListDataStore({
    listFn: PointReportApi.list,
    recoilState: pointReportsState,
  });

  return {
    pointReports$,
    pointReportsAct,
  };
}
