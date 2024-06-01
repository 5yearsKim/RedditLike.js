import { DataModel } from "@/utils/orm";
import type { NotificationFormT, NotificationT } from "@/types/Notification";


const table = "notifications";
export const notificationM = new DataModel<NotificationFormT, NotificationT>(table);
