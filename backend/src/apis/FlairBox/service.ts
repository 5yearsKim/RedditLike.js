import { Injectable } from "@nestjs/common";
import { flairBoxM, FlairBoxSqls } from "@/models/FlairBox";
import * as err from "@/errors";
import { QueryBuilder } from "@/global/db";
import { FlairBoxT, FlairBoxFormT, GetFlairBoxOptionT, ListFlairBoxOptionT } from "@/types";


@Injectable()
export class FlairBoxService {
  constructor() {}

  private lookupBuilder(qb: QueryBuilder, select: any[], opt: GetFlairBoxOptionT) {
    const sqls = new FlairBoxSqls(flairBoxM.table);
    if (opt.$flairs) {
      select.push(sqls.flairs());
    }
    if (opt.$custom_flairs && opt.userId) {
      select.push(sqls.customFlairs(opt.userId));
    }
  }

  async get(id: idT, getOpt: GetFlairBoxOptionT = {}): Promise<FlairBoxT> {
    const found = await flairBoxM.findOne({ id }, {
      builder: (qb, select) => {
        this.lookupBuilder(qb, select, getOpt);
      }
    });
    if (!found) {
      throw new err.NotExistE();
    }
    return found;
  }

  async create(form: FlairBoxFormT): Promise<FlairBoxT> {
    const created = await flairBoxM.create(form);
    if (!created) {
      throw new err.NotAppliedE();
    }
    return created;
  }

  async update(id: idT, form: Partial<FlairBoxFormT>): Promise<FlairBoxT> {
    const updated = await flairBoxM.updateOne({ id }, form);
    if (!updated) {
      throw new err.NotAppliedE();
    }
    return updated;
  }

  async delete(id: idT): Promise<FlairBoxT> {
    const deleted = await flairBoxM.deleteOne({ id });
    if (!deleted) {
      throw new err.NotAppliedE();
    }
    return deleted;
  }

  async list(listOpt: ListFlairBoxOptionT): Promise<ListData<FlairBoxT>> {
    const opt = listOpt;
    const fetched = await flairBoxM.find({
      builder: (qb, select) => {
        this.lookupBuilder(qb, select, opt);
        if (opt.boardId) {
          qb.where("board_id", opt.boardId);
        }
      }
    });
    return { data: fetched, nextCursor: null };
  }
}