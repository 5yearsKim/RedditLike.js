import { Injectable } from "@nestjs/common";
import * as err from "@/errors";
import { notificationM } from "@/models/Notification";
import { listNotification } from "./fncs/list_notification";
import type { ListNotificationOptionT, NotificationT } from "@/types";


@Injectable()
export class NotificationService {
  constructor() {}

  async list(listOpt: ListNotificationOptionT): Promise<ListData<NotificationT>> {
    return await listNotification(listOpt);
  }

  async checkUnread(userId: idT): Promise<NotificationT[]> {
    const updated = await notificationM.updateMany({ user_id: userId, is_checked: false }, { is_checked: true });
    return updated;
  }
}