import { Injectable } from "@nestjs/common";
import * as err from "@/errors";
import { boardMuterM, BoardMuterSqls } from "@/models/BoardMuter";
import type { QueryBuilder } from "@/global/db";
import type { BoardMuterFormT, BoardMuterT, GetBoardMuterOptionT, ListBoardMuterOptionT } from "@/types";

@Injectable()
export class BoardMuterService {
  constructor() {}

  private lookupBuilder(qb: QueryBuilder, select: any[], opt: GetBoardMuterOptionT) {
    const sqls = new BoardMuterSqls(boardMuterM.table);
    if (opt.$author) {
      select.push(sqls.author());
    }
  }

  async get(id: idT, getOpt: GetBoardMuterOptionT = {}) {
    const fetched = await boardMuterM.findById(id, {
      builder: (qb, select) => {
        this.lookupBuilder(qb, select, getOpt);
      }
    });
    if (!fetched) {
      throw new err.NotExistE();
    }
    return fetched;
  }

  async create(form: BoardMuterFormT): Promise<BoardMuterT> {
    const created = await boardMuterM.upsert(form, { onConflict: ["board_id", "user_id"] });
    if (!created) {
      throw new err.NotAppliedE();
    }
    return created;
  }

  async update(id: idT, form: Partial<BoardMuterFormT>): Promise<BoardMuterT> {
    const updated = await boardMuterM.updateOne({ id }, form);
    if (!updated) {
      throw new err.NotAppliedE();
    }
    return updated;
  }

  async delete(id: idT): Promise<BoardMuterT> {
    const deleted = await boardMuterM.deleteOne({ id });
    if (!deleted) {
      throw new err.NotAppliedE();
    }
    return deleted;
  }

  async list(listOpt: ListBoardMuterOptionT): Promise<ListData<BoardMuterT>> {
    const opt = listOpt;

    const fetched = await boardMuterM.find({
      builder: (qb, select) => {
        if (opt.boardId) {
          qb.where("board_id", opt.boardId);
        }

        this.lookupBuilder(qb, select, opt);
      }
    });
    return { data: fetched, nextCursor: null };
  }
}