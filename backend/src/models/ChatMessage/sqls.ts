import { SqlInjector } from "@/utils/orm";
import { knex, type QueryBuilder } from "@/global/db";

export class ChatMessageSqls extends SqlInjector {
  constructor(table: string) {
    super(table);
  }

  sender(): QueryBuilder{
    return knex.select(knex.raw(`get_author(${this.table}.sender_id, cr.board_id)`))
      .from({ cr: "chat_rooms" })
      .whereRaw(`cr.id = ${this.table}.room_id`)
      .as("sender");
  }
}
