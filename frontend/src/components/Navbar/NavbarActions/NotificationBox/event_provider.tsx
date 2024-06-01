"use client";
import React, { ReactNode } from "react";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useMe } from "@/stores/UserStore";
import { useNotificationsStore, getNotificationsListOpt } from "@/stores/NotificationsStore";
import { receiveNotificationEv } from "@/system/global_events";

import { NotificationItem } from "@/components/NotificationItem";


type NotificationEventProviderProps = {
  children: ReactNode
}

export function NotificationEventProvider({ children }: NotificationEventProviderProps): ReactNode {
  const me = useMe();
  const { data: notifications$, actions: notificationsAct } = useNotificationsStore();

  const listOpt = getNotificationsListOpt({ userId: me?.id });

  useEffect(() => {
    if (me?.id) {
      notificationsAct.load(listOpt);
    }
  }, [me?.id]);

  useEffect(() => {
    receiveNotificationEv.addListener("notificationEventProvider", (arg) => {
      const { notification } = arg;

      toast(
        <NotificationItem
          notification={notification}
          markUnreadDisabled
        />,
      );
      notificationsAct.load(listOpt, { force: true });
    });

    return (): void => {
      receiveNotificationEv.removeListener("notificationEventProvider");
    };
  }, [notifications$.data]);

  return children;
}