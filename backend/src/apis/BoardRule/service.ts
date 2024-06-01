import { Injectable } from "@nestjs/common";
import { boardRuleM } from "@/models/BoardRule";
import * as err from "@/errors";
import type { BoardRuleFormT, BoardRuleT, GetBoardOptionT, ListBoardRuleOptionT } from "@/types";

@Injectable()
export class BoardRuleService {
  constructor() {}

  // eslint-disable-next-line
  async get(id: idT, getOpt:GetBoardOptionT = {}): Promise<BoardRuleT> {
    const fetched = await boardRuleM.findById(id);
    if (!fetched) {
      throw new err.NotExistE();
    }
    return fetched;
  }

  async create(form: BoardRuleFormT): Promise<BoardRuleT> {
    const created = await boardRuleM.create(form);
    if (!created) {
      throw new err.NotAppliedE();
    }
    return created;
  }

  async update(id: idT, form: Partial<BoardRuleFormT>): Promise<BoardRuleT> {
    const updated = await boardRuleM.updateOne({ id }, form);
    if (!updated) {
      throw new err.NotAppliedE();
    }
    return updated;
  }

  async delete(id: idT): Promise<BoardRuleT> {
    const deleted = await boardRuleM.deleteOne({ id });
    if (!deleted) {
      throw new err.NotAppliedE();
    }
    return deleted;
  }

  async list(listOpt: ListBoardRuleOptionT): Promise<ListData<BoardRuleT>> {

    const opt = listOpt;
    const fetched = await boardRuleM.find({
      builder: (qb) => {
        if (opt.boardId) {
          qb.where("board_id", opt.boardId);
        }
        qb.limit(30);
        qb.orderBy("rank", "ASC NULLS LAST");
      }
    });

    return { data: fetched, nextCursor: null };
  }

  async rerank(boardId: idT, ruleIds: idT[]): Promise<BoardRuleT[]> {
    const fetched = await boardRuleM.find({
      builder: (qb) => {
        qb.whereIn("id", ruleIds);
      }
    });
    const rules = fetched.filter((item) => item.board_id === boardId);

    for (const rule of rules) {
      const rank = ruleIds.indexOf(rule.id);
      if (rank >= 0) {
        rule.rank = rank;
      }
    }
    let newRules = await Promise.all(
      rules.map(async (rule ) => {
        const updated = await boardRuleM.updateOne({ id: rule.id }, { rank: rule.rank });
        if (!updated) {
          throw new err.NotExistE("rule not exists");
        }
        return updated;
      })
    );

    // sort newRule ascending by rank
    newRules = newRules.sort((a, b) => a.rank! - b.rank!);
    return newRules;
  }
}