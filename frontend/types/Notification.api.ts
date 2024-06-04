
import { NotificationT, ListNotificationOptionT } from "./Notification";


// (GET) /
export type ListRqs = ListNotificationOptionT
export type ListRsp = ListData<NotificationT>

// (POST) /check
export type CheckRqs = null
export type CheckRsp = NotificationT[]