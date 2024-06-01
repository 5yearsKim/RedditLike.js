import { SqlInjector } from "@/utils/orm";
import { knex, type Raw } from "@/global/db";


export class BoardManagerSqls extends SqlInjector {
  constructor(table: string) {
    super(table);
  }

  author(): Raw {
    return knex.raw("get_author(board_managers.user_id, board_managers.board_id) as author");
  }
}