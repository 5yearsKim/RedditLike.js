import { SqlInjector } from "@/utils/orm";
// import { knex, type QueryBuilder } from "@/global/db";

export class CommentReportSqls extends SqlInjector {
  constructor(table: string) {
    super(table);
  }
}
