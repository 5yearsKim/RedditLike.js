import { Injectable } from "@nestjs/common";
import { flairM } from "@/models/Flair";
import type { FlairFormT, FlairT } from "@/types/Flair";
import * as err from "@/errors";

@Injectable()
export class FlairService {
  constructor() {}

  async get(id: idT): Promise<FlairT> {
    const fetched = await flairM.findById(id);
    if (!fetched) {
      throw new err.NotExistE("flair not exists");
    }
    return fetched;
  }

  async create(form: FlairFormT): Promise<FlairT> {
    const created = await flairM.create(form);
    if (!created) {
      throw new err.NotAppliedE();
    }
    return created;
  }

  async update(id: idT, form: Partial<FlairFormT>): Promise<FlairT> {
    const updated = await flairM.updateOne({ id }, form);
    if (!updated) {
      throw new err.NotAppliedE();
    }
    return updated;
  }

  async delete(id: idT): Promise<FlairT> {
    const deleted = await flairM.deleteOne({ id });
    if (!deleted) {
      throw new err.NotAppliedE();
    }
    return deleted;
  }

  async rerank(boxId: idT, flairIds: idT[]): Promise<FlairT[]> {
    const fetched = await flairM.find({
      builder: (qb) => {
        qb.whereIn("id", flairIds);
      }
    });
    const flairs = fetched.filter((item) => item.box_id === boxId);
    for (const flair of flairs) {
      const rank = flairIds.indexOf(flair.id);
      if (rank >= 0) {
        flair.rank = rank;
      }
    }
    let newFlairs = await Promise.all(
      flairs.map(async (flair) => {
        const updated = await flairM.updateOne({ id: flair.id }, { rank: flair.rank });
        if (!updated) {
          throw new err.NotExistE("flair not exists");
        }
        return updated;
      })
    );
    // sort newFlair ascending by rank
    newFlairs = newFlairs.sort((a, b) => a.rank! - b.rank!);

    return newFlairs;
  }
}

