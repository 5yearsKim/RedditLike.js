import { SqlInjector } from "@/utils/orm";
import { knex, QueryBuilder } from "@/global/db";

export class ChatRoomSqls extends SqlInjector {
  constructor(table: string) {
    super(table);
  }

  board(): QueryBuilder {
    return knex.select(knex.raw("TO_JSON(b.*)"))
      .from({ b: "boards" })
      .whereRaw(`b.id = ${this.table}.board_id`)
      .as("board");
  }

  lastMessage(): QueryBuilder {
    // need to add author
    return knex("chat_messages AS cm")
      .select(knex.raw("TO_JSON(cm.*)"))
      .whereRaw(`cm.room_id = ${this.table}.id`)
      .orderByRaw("cm.created_at DESC")
      .limit(1)
      .as("last_message");
  }

  participants(): QueryBuilder {
    return knex.select(knex.raw("COALESCE(ARRAY_TO_JSON(ARRAY_AGG(cu)), '[]'::JSON)"))
      .from("chat_users AS cu")
      .whereNull("cu.deleted_at")
      .whereRaw(`cu.room_id = ${this.table}.id`)
      .as("participants");
  }

  opponent(userId: idT): QueryBuilder {
    return knex.select(knex.raw(`get_author(cu.user_id, ${this.table}.board_id)`))
      .from("chat_users AS cu")
      .whereRaw(`cu.room_id = ${this.table}.id AND cu.user_id != ${userId}`)
      .limit(1)
      .as("opponent");
  }

  unreadCount(userId: idT): QueryBuilder {
    return knex.count("cm.id")
      .from("chat_messages AS cm")
      .joinRaw(`join chat_users AS cu on cu.room_id = cm.room_id AND cu.user_id = ${userId}`)
      .whereRaw(`cm.room_id = ${this.table}.id`)
      .whereRaw("cm.created_at > COALESCE(cu.last_checked_at, '-infinity')")
      .as("unread_cnt");
  }
}
