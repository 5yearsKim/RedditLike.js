import { SqlInjector } from "@/utils/orm";
import { knex, type QueryBuilder } from "@/global/db";
import { subDays } from "date-fns";
import { PostSqls } from "@/models/Post";


export class BoardSqls extends SqlInjector {
  constructor(table: string) {
    super(table);
  }

  userDefaults(uid: idT): QueryBuilder[] {
    return [
      this._follower(uid),
      this._muter(uid),
      this._block(uid),
    ];
  }

  _follower(uid: idT): QueryBuilder {
    return knex.select(knex.raw("TO_JSON(bf.*)"))
      .from({ bf: "board_followers" })
      .whereRaw(`bf.board_id = ${this.table}.id AND bf.user_id = ${uid}`)
      .as("follower");
  }

  _muter(uid: idT): QueryBuilder {
    return knex.select(knex.raw("TO_JSON(bmt.*)"))
      .from({ bmt: "board_muters" })
      .whereRaw(`bmt.board_id = ${this.table}.id AND bmt.user_id = ${uid}`)
      .as("muter");
  }

  _block(uid: idT): QueryBuilder {
    return knex.select(knex.raw("TO_JSON(bb.*)"))
      .from({ bb: "board_blocks" })
      .whereRaw(`bb.board_id = ${this.table}.id AND bb.user_id = ${uid}`)
      .as("block");
  }

  posts(option: {limit?: number} = {}): QueryBuilder {
    const tbl = "posts";

    const postSqls = new PostSqls(tbl);

    const query = knex(tbl);

    query.select([
      "*",
      ...postSqls.defaults(),
    ])
      .whereRaw(`${tbl}.board_id = ${this.table}.id`)
      .whereNotNull(`${tbl}.published_at`)
      .whereNull(`${tbl}.deleted_at`)
      .whereNull(`${tbl}.trashed_at`)
      .orderByRaw(`${tbl}.published_at DESC`)
      .where(`${tbl}.published_at`, ">", subDays(new Date(), 7))
      .limit(option.limit ?? 7);

    return knex.select(knex.raw("COALESCE(ARRAY_TO_JSON(ARRAY_AGG(p)), '[]'::JSON)"))
      .fromRaw(`(${query.toString()}) p`)
      .as("posts");
  }

}
