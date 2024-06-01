import { useEffect } from "react";
import { receiveNotificationEv } from "@/system/global_events";
import { socket } from "@/system/socket";
import type { ReceiveNotificationArgT } from "@/types/Notification.socket";


export function useNotificationSocketListener(isConnected: boolean) {
  useEffect(() => {
    if (!isConnected) {
      return;
    }
    function onReceiveNotification(arg: ReceiveNotificationArgT): void {
      receiveNotificationEv.emit(arg);
    }

    socket.on("receive-notification", onReceiveNotification);
    return (): void => {
      socket.off("receive-notification", onReceiveNotification);
    };
  }, [isConnected]);
}
