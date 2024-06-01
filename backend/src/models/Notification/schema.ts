import { z } from "zod";
import { baseModelSchema, insertFormSchema, getOptionSchema } from "../$commons/schema";
import { TG } from "@/utils/type_generator";


const notificationTypeEnum = z.enum([
  "test", "commentOnPost", "commentOnComment", "createManager", "deleteManager",
  "trashPost", "trashComment"
]);

const notificationFormZ = {
  user_id: z.number().int(),
  board_id: z.number().int().nullish(),
  type: notificationTypeEnum,
  message: z.string(),
  arg: z.any(),
  is_checked: z.boolean().nullish(),
};

export const notificationFormSchema = insertFormSchema.extend(notificationFormZ);

export const notificationSchema = baseModelSchema.extend(notificationFormZ);

export const getNotificationOptionSchema = getOptionSchema.extend({
  $board: z.coerce.boolean(),
}).partial();
export const listNotificationOptionSchema = getNotificationOptionSchema.extend({
  limit: z.coerce.number().int().positive(),
  cursor: z.string(),
  type: notificationTypeEnum,
  boardId: z.coerce.number().int(),
}).partial();


const tgKey = "Notification";

TG.add(tgKey, "NotificationTypeT", notificationTypeEnum);

TG.add(tgKey, "NotificationFormT", notificationFormSchema);
TG.add(tgKey, "_NotificationT", notificationSchema, { private: true });

TG.add(tgKey, "GetNotificationOptionT", getNotificationOptionSchema);
TG.add(tgKey, "ListNotificationOptionT", listNotificationOptionSchema);

