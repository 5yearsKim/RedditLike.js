"use client";

import { atom } from "recoil";
import { ListDataT, useListDataStore } from "./molds/list_data";
import * as NotificationApi from "@/apis/notifications";
import type { NotificationT, ListNotificationOptionT } from "@/types";

const notificationsState = atom<ListDataT<NotificationT, ListNotificationOptionT>>({
  key: "notificationsState",
  default: {
    status: "init",
    data: [],
    listArg: {} as ListNotificationOptionT,
    appendingStatus: "init",
    nextCursor: null,
    lastUpdated: null,
  },
});

export function useNotificationsStore() {
  return useListDataStore({
    listFn: NotificationApi.list,
    cacheCfg: {
      genKey: (arg) => `notification-${JSON.stringify(arg)}`,
      ttl: 1000 * 60 * 10, // 10 minutes
    },
    recoilState: notificationsState,
  });
}

export const getNotificationsListOpt = ({ userId }: { userId?: idT }): ListNotificationOptionT => {
  return {
    userId,
    $board: true,
  };
};
