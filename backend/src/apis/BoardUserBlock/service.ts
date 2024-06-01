import { Injectable } from "@nestjs/common";
import * as err from "@/errors";
import { boardUserBlockM, BoardUserBlockSqls } from "@/models/BoardUserBlock";
import type {
  BoardUserBlockFormT, BoardUserBlockT,
  GetBoardUserBlockOptionT, ListBoardUserBlockOptionT,
} from "@/types";


function lookupBuilder(select: any[], getOpt: GetBoardUserBlockOptionT ): void {
  const sqls = new BoardUserBlockSqls(boardUserBlockM.table);
  if (getOpt.$board) {
    select.push(sqls.board());
  }
  if (getOpt.$target) {
    select.push(sqls.target());
  }
}


@Injectable()
export class BoardUserBlockService {
  constructor() {}

  async get(id: idT, getOpt: GetBoardUserBlockOptionT = {}): Promise<BoardUserBlockT> {
    const fetched = await boardUserBlockM.findById(id, {
      builder: (qb, select) => {
        lookupBuilder(select, getOpt);
      }
    });
    if (!fetched) {
      throw new err.NotExistE();
    }
    return fetched;
  }

  async create(form: BoardUserBlockFormT): Promise<BoardUserBlockT> {
    const created = await boardUserBlockM.create(form);
    if (!created) {
      throw new err.NotAppliedE();
    }
    return created;
  }

  async list(listOpt: ListBoardUserBlockOptionT): Promise<ListData<BoardUserBlockT>> {
    const opt = listOpt;

    if (!opt.userId) {
      throw new err.InvalidDataE("userId is required");
    }

    const fetched = await boardUserBlockM.find({
      builder: (qb, select) => {
        qb.orderBy("created_at", "desc");
        qb.where("from_id", opt.userId);

        lookupBuilder(select, opt);
      }
    });

    return { data: fetched, nextCursor: null };
  }

  async delete(id: idT): Promise<BoardUserBlockT> {
    const deleted = await boardUserBlockM.deleteOne({ id });
    if (!deleted) {
      throw new err.NotAppliedE();
    }
    return deleted;
  }
}