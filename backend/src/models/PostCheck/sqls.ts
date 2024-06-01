import { SqlInjector } from "@/utils/orm";
// import { knex } from "@/global/db";

export class PostCheckSqls extends SqlInjector {
  constructor(table: string) {
    super(table);
  }
}
