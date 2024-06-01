import { ReceiveNotificationArgT } from "@/types/Notification.socket";
import { io } from "@/sockets/global";
import { toRoomId } from "../utils";

export function onNotificationCreatedForwarded(ev: NotificationCreatedEventT): void {
  const [noti] = ev.args;
  const arg: ReceiveNotificationArgT = { notification: noti };
  io.to(toRoomId(noti.user_id, "user")).emit("receive-notification", arg);
}