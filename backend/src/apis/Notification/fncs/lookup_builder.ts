import { notificationM, NotificationSqls } from "@/models/Notification";
import type { GetNotificationOptionT } from "@/types";

export function lookupBuilder(select: any[], getOpt: GetNotificationOptionT) {
  const sqls = new NotificationSqls(notificationM.table);

  if (getOpt.$board) {
    select.push(sqls.board());
  }

}