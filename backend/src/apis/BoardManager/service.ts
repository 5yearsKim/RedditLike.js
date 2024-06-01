import { Injectable } from "@nestjs/common";
import { boardManagerM, BoardManagerSqls } from "@/models/BoardManager";
import * as err from "@/errors";
import type {
  BoardManagerFormT, BoardManagerT,
  GetBoardManagerOptionT, ListBoardManagerOptionT,
} from "@/types/BoardManager";
import type { QueryBuilder } from "@/global/db";

@Injectable()
export class BoardManagerService {
  constructor() {}

  private lookupBuilder(qb: QueryBuilder, select: any[], opt: GetBoardManagerOptionT) {
    const sqls = new BoardManagerSqls(boardManagerM.table);

    if (opt.$author) {
      select.push(sqls.author());
    }
  }

  async getByUser(userId: idT, boardId: idT): Promise<BoardManagerT|null> {
    const found = await boardManagerM.findOne({ user_id: userId, board_id: boardId });
    return found;
  }

  async get(id: idT, getOpt: GetBoardManagerOptionT = {}): Promise<BoardManagerT> {
    const found = await boardManagerM.findById(id, {
      builder: (qb, select) => {
        this.lookupBuilder(qb, select, getOpt);
      }
    });
    if (!found) {
      throw new err.NotExistE();
    }
    return found;
  }

  async create(form: BoardManagerFormT): Promise<BoardManagerT> {
    const created = await boardManagerM.create(form);
    if (!created) {
      throw new err.NotAppliedE();
    }
    return created;
  }

  async update(id: idT, form: Partial<BoardManagerFormT>): Promise<BoardManagerT> {
    const updated = await boardManagerM.updateOne({ id }, form);
    if (!updated) {
      throw new err.NotAppliedE();
    }
    return updated;
  }

  async delete(id: idT): Promise<BoardManagerT> {
    const deleted = await boardManagerM.deleteOne({ id });
    if (!deleted) {
      throw new err.NotAppliedE();
    }
    return deleted;
  }

  async list(listOpt: ListBoardManagerOptionT): Promise<ListData<BoardManagerT>> {
    const opt = listOpt;
    const fetched = await boardManagerM.find({
      builder: (qb, select) => {
        if (opt.boardId) {
          qb.where("board_id", opt.boardId);
        }
        qb.limit(30);
        this.lookupBuilder(qb, select, opt);
      }
    });
    return { data: fetched, nextCursor: null };
  }
}