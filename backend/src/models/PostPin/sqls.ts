import { SqlInjector } from "@/utils/orm";
// import { knex } from "@/global/db";

export class PostPinSqls extends SqlInjector {
  constructor(table: string) {
    super(table);
  }
}
