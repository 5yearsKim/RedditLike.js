import { SqlInjector } from "@/utils/orm";
// import { knex, type QueryBuilder } from "@/global/db";

export class PostReportSqls extends SqlInjector {
  constructor(table: string) {
    super(table);
  }

}
