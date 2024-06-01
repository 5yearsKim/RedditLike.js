import { Injectable } from "@nestjs/common";
import { flagM } from "@/models/Flag";
import * as err from "@/errors";
import type { FlagFormT, FlagT, ListFlagOptionT } from "@/types";


@Injectable()
export class FlagService {
  constructor() {}

  async create(form: FlagFormT): Promise<FlagT> {
    const created = await flagM.create(form);
    if (!created) {
      throw new err.NotAppliedE();
    }
    return created;
  }

  async get(id: idT): Promise<FlagT> {
    const flag = await flagM.findById(id);
    if (!flag) {
      throw new err.NotExistE();
    }
    return flag;
  }

  async update(id: idT, form: Partial<FlagFormT>) {
    const updated = await flagM.updateOne({ id }, form);
    if (!updated) {
      throw new err.NotAppliedE();
    }
    return updated;
  }

  async delete(id: idT) {
    const deleted = await flagM.deleteOne({ id });
    if (!deleted) {
      throw new err.NotAppliedE();
    }
    return deleted;
  }

  async list(listOpt: ListFlagOptionT): Promise<ListData<FlagT>> {
    const opt = listOpt;

    const flags = await flagM.find({
      builder: (qb) => {
        if (opt.boardId) {
          qb.where({ board_id: listOpt.boardId });
        }
        qb.limit(30);
      }
    });

    return { data: flags, nextCursor: null };
  }
}