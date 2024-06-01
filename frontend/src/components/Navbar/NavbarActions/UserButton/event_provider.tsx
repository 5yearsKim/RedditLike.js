"use client";

import { useEffect, ReactNode } from "react";
import { useMe } from "@/stores/UserStore";
import { usePointReportsStore } from "@/stores/PointReportsStore";
import { format as dfFormat, startOfMonth, endOfMonth } from "date-fns";
import { useGroup } from "@/stores/GroupStore";
import type { ListPointReportOptionT } from "@/types";


export function PointEventProvider({ children }: { children: ReactNode }): ReactNode {
  const group = useGroup();
  const me = useMe();

  const { pointReportsAct } = usePointReportsStore();

  const today = new Date();
  const listOpt: ListPointReportOptionT = {
    groupId: group.id,
    userId: me?.id,
    limit: 31,
    fromDate: dfFormat(startOfMonth(today), "yyyy-MM-dd"),
    untilDate: dfFormat(endOfMonth(today), "yyyy-MM-dd"),
  };
  useEffect(() => {
    if (me?.id) {
      pointReportsAct.load(listOpt);
    }
  }, [me?.id, group.id]);

  if (!group.use_point || !me) {
    return children;
  }

  return children;
}