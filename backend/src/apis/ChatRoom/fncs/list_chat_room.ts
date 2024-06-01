import { chatRoomM } from "@/models/ChatRoom";
import { encodeCursor, decodeCursor } from "@/utils/formatter";
import * as err from "@/errors";
import { lookupBuilder } from "./lookup_builder";
import type { ChatRoomT, ListChatRoomOptionT } from "@/types";


export async function listChatRoom(opt: ListChatRoomOptionT = {}) {
  const table = chatRoomM.table;
  const limit = opt.limit ?? 30;
  let nextCursor: null|string = null;
  const getNextCursor: (item: ChatRoomT) => string|null = (item) => encodeCursor({ last_message_at: item.last_message_at });


  const fetched = await chatRoomM.find({
    builder: (qb, select) => {
      qb.orderByRaw("last_message_at DESC NULLS LAST");
      qb.limit(limit);

      if (opt.cursor) {
        const cursor = decodeCursor(opt.cursor);
        qb.where(`${table}.last_message_at`, "<", cursor.last_message_at);
      }

      // public
      if (opt.public) {
        switch (opt.public) {
        case "only":
          qb.where(`${table}.is_public`, true);
          break;
        // only users chat room
        case "except":
          if (!opt.userId) {
            throw new err.InvalidFieldE("invalid userId with:" + opt.userId);
          }
          qb.rightJoin("chat_users AS cu", function (this: any) {
            this.on("cu.room_id", "=", `${table}.id`).andOn("cu.user_id", "=", opt.userId);
          });
          qb.where("is_public", false);
          break;
        default:
          throw new err.InvalidFieldE("invalid public with:" + opt.public);
        }
      }

      // lastMessage
      if (opt.lastMessage == "only") {
        qb.whereNotNull("last_message_at");
      }

      // boardId
      if (opt.boardId) {
        qb.where("board_id", opt.boardId);
      }

      lookupBuilder(select, opt);
    }
  });

  if (fetched.length >= limit) {
    nextCursor = getNextCursor(fetched[fetched.length - 1]);
  }

  return {
    data: fetched,
    nextCursor,
  };
}