import { chatMessageM } from "@/models/ChatMessage";
import { encodeCursor, decodeCursor } from "@/utils/formatter";
import { lookupBuilder } from "./lookup_builder";
import * as err from "@/errors";
import type { ChatMessageT, ListChatMessageOptionT } from "@/types";


export async function listChatMessage(opt: ListChatMessageOptionT): Promise<ListData<ChatMessageT>> {
  const table = chatMessageM.table;
  const limit = opt.limit ?? 30;
  let nextCursor: string|null = null;
  const getNextCursor = (item: ChatMessageT): string => encodeCursor({ created_at: item.created_at });

  const fetched = await chatMessageM.find({
    builder: (qb, select) => {
      qb.orderByRaw(`${table}.created_at DESC`);
      qb.limit(limit);

      // cursor
      if (opt.cursor) {
        const cursor = decodeCursor(opt.cursor);
        qb.where(`${table}.created_at`, "<", cursor.created_at);
      }
      // roomId
      if (opt.roomId) {
        qb.where(`${table}.room_id`, "=", opt.roomId);
      } else {
        throw new err.InvalidDataE("roomId should be given to fetch message");
      }

      lookupBuilder(select, opt);
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
