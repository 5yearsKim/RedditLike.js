import { SqlInjector } from "@/utils/orm";
import { knex, type QueryBuilder } from "@/global/db";


export class PostSqls extends SqlInjector {
  constructor(table: string) {
    super(table);
  }

  defaults(): QueryBuilder[] {
    return [
      this._author(),
      this._numCheck(),
      this._flags(),
      this._images(),
      this._videos(),
    ];
  }

  userDefaults(uid: idT): QueryBuilder[] {
    return [
      this._myScore(uid),
      this._bookmark(uid),
      this._check(uid),
    ];
  }

  managerDefaults(): QueryBuilder[] {
    return [
      this._reports(),
      this._numIgnoredReport(),
      this._numResolvedReport(),
    ];
  }

  // defaults
  _author(): QueryBuilder {
    return knex.select(knex.raw(`get_author(${this.table}.author_id, ${this.table}.board_id)`)).as("author");
  }

  _numCheck(): QueryBuilder {
    return knex.select(knex.raw("COUNT(*)::integer"))
      .from({ pc: "post_checks" })
      .whereRaw(`${this.table}.id = pc.post_id`)
      .as("num_check");
  }
  _flags(): QueryBuilder {
    return knex.select(knex.raw(`
      COALESCE(ARRAY_TO_JSON(ARRAY_AGG(flags.*)), '[]'::JSON)
      FROM x_post_flag  as pf
      LEFT JOIN flags ON flags.id = pf.flag_id
      WHERE pf.post_id = ${this.table}.id
    `)).as("flags");
  }
  _images(): QueryBuilder {
    return knex.select(knex.raw(`
      COALESCE(ARRAY_TO_JSON(ARRAY_AGG(images.*)), '[]'::JSON)
      FROM x_post_image  as xpi
      inner JOIN images ON images.id = xpi.image_id
      WHERE xpi.post_id = ${this.table}.id
    `)).as("images");
  }
  _videos(): QueryBuilder {
    return knex.select(knex.raw(`
      COALESCE(ARRAY_TO_JSON(ARRAY_AGG(videos.*)), '[]'::JSON)
      FROM x_post_video as xpv
      inner JOIN videos ON videos.id = xpv.video_id
      WHERE xpv.post_id = ${this.table}.id
    `)).as("videos");
  }

  // user defaults
  _check(uid: idT): QueryBuilder {
    return knex.select(knex.raw("TO_JSON(pc.*)::json"))
      .from({ pc: "post_checks" })
      .whereRaw(`pc.post_id = ${this.table}.id AND pc.user_id = '${uid}'`)
      .as("check");
  }

  _myScore(uid: idT): QueryBuilder {
    return knex.select("score")
      .from({ pv: "post_votes" })
      .whereRaw(`${this.table}.id = pv.post_id AND pv.user_id = ${uid}`)
      .as("my_score");
  }

  _bookmark(uid: idT): QueryBuilder {
    return knex.select(knex.raw("TO_JSON(pb.*)::json"))
      .from({ pb: "post_bookmarks" })
      .whereRaw(`pb.post_id = ${this.table}.id AND pb.user_id = '${uid}'`)
      .as("bookmark");
  }

  // manager defaults
  _reports(): QueryBuilder {
    return knex({ pr: "post_reports" }).select(knex.raw("COALESCE(ARRAY_TO_JSON(ARRAY_AGG(pr ORDER BY pr.created_at DESC)), '[]'::JSON)"))
      .whereRaw(`${this.table}.id = pr.post_id AND ignored_at IS NULL AND resolved_at IS NULL`)
      .as("reports");
  }

  _numIgnoredReport(): QueryBuilder {
    return knex({ pr: "post_reports" }).count("id")
      .whereRaw(`ignored_at IS NOT NULL AND pr.post_id = ${this.table}.id`)
      .as("num_ignored_report");
  }

  _numResolvedReport(): QueryBuilder {
    return knex({ pr: "post_reports" }).count("id")
      .whereRaw(`resolved_at IS NOT NULL AND pr.post_id = ${this.table}.id`)
      .as("num_resolved_report");
  }


  // queries

  board(): QueryBuilder {
    // const toSelect = opt.summarize ?
    //   ["b.id", "b.name", "b.use_theme", "b.bg_color", "b.text_color", "b.avatar_url"] :
    //   ["b.*"];
    return knex.select(knex.raw("TO_JSON(b.*)"))
      .from({ b: "boards" })
      .whereRaw(`b.id = ${this.table}.board_id`)
      .as("board");
  }

  pin(): QueryBuilder {
    return knex.select(knex.raw("TO_JSON(pp.*)::json"))
      .from({ pp: "post_pins" })
      .whereRaw(`pp.post_id = ${this.table}.id AND pp.board_id = ${this.table}.board_id`)
      .as("pin");
  }
}

