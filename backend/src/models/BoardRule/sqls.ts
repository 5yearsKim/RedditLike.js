import { SqlInjector } from "@/utils/orm";
// import { knex } from "@/global/db";

export class BoardRuleSqls extends SqlInjector {
  constructor(table: string) {
    super(table);
  }
}
