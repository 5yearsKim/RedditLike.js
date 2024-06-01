import { SqlInjector } from "@/utils/orm";
import { knex, type QueryBuilder } from "@/global/db";

export class CommentSqls extends SqlInjector {
  constructor(table: string) {
    super(table);
  }

  defaults(): QueryBuilder[] {
    return [
      this._author(),
    ];
  }

  userDefaults(uid: idT): QueryBuilder[] {
    return [
      this._myScore(uid),
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
    return knex.select(knex.raw(`get_author(${this.table}.author_id, p.board_id)`))
      .from("posts AS p")
      .whereRaw(`p.id = ${this.table}.post_id`)
      .as("author");
  }

  // user defaults
  _myScore(uid: idT): QueryBuilder {
    return knex.select("score")
      .from({ cv: "comment_votes" })
      .whereRaw(`${this.table}.id = cv.comment_id AND cv.user_id = ${uid}`)
      .as("my_score");
  }

  // manager defaults
  _reports(): QueryBuilder {
    return knex({ cr: "comment_reports" }).select(knex.raw("COALESCE(ARRAY_TO_JSON(ARRAY_AGG(cr ORDER BY cr.created_at DESC)), '[]'::JSON)"))
      .whereRaw(`${this.table}.id = cr.comment_id AND ignored_at IS NULL AND resolved_at IS NULL`)
      .as("reports");
  }

  _numIgnoredReport(): QueryBuilder {
    return knex({ cr: "comment_reports" }).count("id")
      .whereRaw(`ignored_at IS NOT NULL AND cr.comment_id = ${this.table}.id`)
      .as("num_ignored_report");
  }

  _numResolvedReport(): QueryBuilder {
    return knex({ cr: "comment_reports" }).count("id")
      .whereRaw(`resolved_at IS NOT NULL AND cr.comment_id = ${this.table}.id`)
      .as("num_resolved_report");
  }


  // queries

  post(): QueryBuilder {
    return knex.select(knex.raw("TO_JSON(posts.*)::json"))
      .from("posts")
      .whereRaw(`posts.id = ${this.table}.post_id`)
      .as("post");
  }

  parent(): QueryBuilder {
    return knex.select(knex.raw("TO_JSON(parent.*)::json"))
      .from({ parent: "comments" })
      .whereRaw(`parent.id = ${this.table}.parent_id`)
      .as("parent");
  }

  authorIdx(): QueryBuilder {
    return knex.select("ai.idx")
      .from({ ai: "post_comment_author_idx" })
      .whereRaw(`ai.author_id = ${this.table}.author_id`)
      .andWhereRaw(`ai.post_id = ${this.table}.post_id`)
      .as("author_idx");
  }
}
