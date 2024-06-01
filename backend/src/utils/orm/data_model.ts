import { knex, type QueryBuilder, type Raw } from "@/global/db";
import { BaseModelT } from "@/types/$commons";

interface CreateOptionT {
  trx?: any;
}

interface UpsertOptionT {
  onConflict: string | string[];
  trx?: any;
}

interface DeleteOptionT {
  trx?: any;
}

interface UpdateOptionT {
  trx?: any;
}

interface FindOptionT {
  builder?: (qb: QueryBuilder, select: (string|QueryBuilder|Raw)[]) => void;
}

export class DataModel<ModelFormT, ModelT extends ModelFormT & BaseModelT> {
  constructor(readonly table: string) {}

  async create(insertForm: ModelFormT, option: CreateOptionT = {}): Promise<ModelT | null> {
    const created = await this.createMany([insertForm], option);

    if (!created) {
      return null;
    }
    return created[0];
  }

  async createMany(forms: ModelFormT[], option: CreateOptionT = {}): Promise<ModelT[]> {
    const db = option.trx ?? knex;
    const created = (await db(this.table).insert(forms).returning("*")) as ModelT[];
    return created;
  }

  async upsert(
    insertForm: ModelFormT,
    option: UpsertOptionT = { onConflict: "id" },
  ): Promise<ModelT | null> {
    const created = await this.upsertMany([insertForm], option);
    if (!created) {
      return null;
    }
    return created[0];
  }

  async upsertMany(
    forms: ModelFormT[],
    option: UpsertOptionT = { onConflict: "id" },
  ): Promise<ModelT[]> {
    const db = option.trx ?? knex;
    const created = (await db(this.table)
      .insert(forms)
      .onConflict(option.onConflict as any)
      .merge()
      .returning("*")) as ModelT[];
    return created;
  }

  async deleteOne(fields: Partial<ModelT>, option: DeleteOptionT = {}): Promise<ModelT | null> {
    const db = option.trx ?? knex;
    const deleted = (await db(this.table)
      .delete()
      .whereIn("id", (qb: any) => {
        return qb.select("id").where(fields).limit(1);
      })
      .returning("*")) as ModelT[];
    if (!deleted) {
      return null;
    }
    return deleted[0];
  }

  async deleteMany(fields: Partial<ModelT>, option: DeleteOptionT = {}): Promise<ModelT[]> {
    const db = option.trx ?? knex;
    const deleted = (await db(this.table).delete().where(fields).returning("*")) as ModelT[];
    return deleted;
  }

  async updateOne(
    whereFields: Partial<ModelT>,
    updateFields: Partial<ModelT>,
    option: UpdateOptionT = {},
  ): Promise<ModelT | null> {
    const db = option.trx ?? knex;
    const updated = (await db(this.table)
      .update(updateFields)
      .whereIn("id", (qb: any) => {
        return qb.select("id").where(whereFields).limit(1);
      })
      .returning("*")) as ModelT[];
    if (!updated) {
      return null;
    }
    return updated[0];
  }

  async updateMany(
    whereFields: Partial<ModelT>,
    updateFields: Partial<ModelT>,
    option: UpdateOptionT = {},
  ): Promise<ModelT[]> {
    const db = option.trx ?? knex;
    const updated = (await db(this.table)
      .update(updateFields)
      .where(whereFields)
      .returning("*")) as ModelT[];
    return updated;
  }

  async findById(id: idT, option: FindOptionT = {}): Promise<ModelT | null> {
    const findQuery = this.findQuery({
      builder: (qb, select) => {
        qb.where(`${this.table}.id`, "=", id);
        if (option.builder) {
          option.builder(qb, select);
        }
      },
    }).first();
    const fetched = (await findQuery) as ModelT | undefined;
    return fetched ?? null;
  }

  async findOne(fields: Partial<ModelT>, option: FindOptionT = {}): Promise<ModelT | null> {
    const findQuery = this.findQuery({
      builder: (qb, select) => {
        qb.where(fields);
        if (option.builder) {
          option.builder(qb, select);
        }
      },
    }).first();
    const fetched = (await findQuery) as ModelT | undefined;
    return fetched ?? null;
  }

  async find(option: FindOptionT = {}): Promise<ModelT[]> {
    const findQuery = this.findQuery(option);
    const fetched = (await findQuery) as ModelT[];
    return fetched;
  }

  findQuery(option: FindOptionT = {}): QueryBuilder {
    const select: (string|QueryBuilder)[] = [`${this.table}.*`];
    const query = knex(this.table).select(select);

    if (option.builder) {
      option.builder(query, select);
    }

    return query;
  }
}
