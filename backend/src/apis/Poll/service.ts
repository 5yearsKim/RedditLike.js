import { Injectable } from "@nestjs/common";
import * as err from "@/errors";
import { knex } from "@/global/db";
import { pollM } from "@/models/Poll";
import { pollCandM } from "@/models/PollCand";
import { lookupBuilder } from "./fncs/lookup_builder";
import type { PollT, PollFormT, PollCandFormT, GetPollOptionT } from "@/types";

@Injectable()
export class PollService {
  constructor() {}

  async create(
    form: PollFormT,
    relations?: { cands?: PollCandFormT[] },
  ): Promise<PollT> {

    let created: PollT|null = null;

    await knex.transaction(async (trx) => {
      created = await pollM.create(form, { trx });

      if (relations?.cands) {
        const forms = relations.cands.map((cand, idx) => ({
          ...cand,
          poll_id: created!.id,
          rank: idx,
        }));
        await pollCandM.createMany(forms, { trx });
      }
    });

    if (!created) {
      throw new err.NotAppliedE();
    }

    return created;
  }

  async update(
    id: idT,
    form: Partial<PollFormT>,
    relations?: { cands?: PollCandFormT[] },
  ): Promise<PollT> {

    let updated: PollT|null = null;

    await knex.transaction(async (trx) => {
      updated = await pollM.updateOne({ id }, form, { trx });

      if (relations?.cands) {
        await pollCandM.deleteMany({ poll_id: updated!.id }, { trx });
        const forms = relations.cands.map((cand, idx) => ({
          ...cand,
          poll_id: updated!.id,
          rank: idx,
        }));
        await pollCandM.createMany(forms, { trx });
      }
    });

    if (!updated) {
      throw new err.NotAppliedE();
    }

    return updated;
  }

  async get(id: idT, getOpt: GetPollOptionT = {}): Promise<PollT> {
    const fetched = await pollM.findById(id, {
      builder: (qb, select) => {
        lookupBuilder(select, getOpt);
      }
    });
    if (!fetched) {
      throw new err.NotExistE();
    }
    return fetched;
  }

}