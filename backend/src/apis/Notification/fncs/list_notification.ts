import { notificationM } from "@/models/Notification";
import { encodeCursor, decodeCursor } from "@/utils/formatter";
import * as err from "@/errors";
import { lookupBuilder } from "./lookup_builder";
import type { NotificationT, ListNotificationOptionT } from "@/types";


export async function listNotification(opt: ListNotificationOptionT): Promise<ListData<NotificationT>> {
  const table = notificationM.table;
  const limit = opt.limit ?? 30;
  let nextCursor: string|null = null;
  const getNextCursor = (item: NotificationT): string => encodeCursor({ created_at: item.created_at });

  if (!opt.userId) {
    throw new err.InvalidDataE("userId should be given to fetch notification");
  }

  const fetched = await notificationM.find({
    builder: (qb, select) => {
      qb.limit(limit);
      qb.orderByRaw("created_at DESC");
      qb.where("user_id", opt.userId);

      if (opt.cursor) {
        const cursor = decodeCursor(opt.cursor);
        qb.where(`${table}.created_at`, "<", cursor.created_at);
      }

      if (opt.type) {
        qb.where(`${table}.type`, "=", opt.type);
      }

      if (opt.$board) {
        lookupBuilder(select, opt);
      }
    }
  });

  if (fetched.length >= limit) {
    const lastItem = fetched[fetched.length - 1];
    nextCursor = getNextCursor(lastItem);
  }

  return {
    data: fetched,
    nextCursor
  };

}