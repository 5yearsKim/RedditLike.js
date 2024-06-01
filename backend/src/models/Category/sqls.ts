import { SqlInjector } from "@/utils/orm";
import { knex, type QueryBuilder } from "@/global/db";

export class CategorySqls extends SqlInjector {
  constructor(table: string) {
    super(table);
  }

  myLike(userId: idT): QueryBuilder {
    return knex.select(knex.raw(`--sql
      EXISTS (SELECT * from x_user_category xuc where ${this.table}.id = xuc.category_id AND xuc.user_id = '${userId}')
    `)).as("my_like");

  }
}
