import { SqlInjector } from "@/utils/orm";
import { knex } from "@/global/db";

export class _Sqls extends SqlInjector {
  constructor(table: string) {
    super(table);
  }
}
