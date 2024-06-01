import { pollCandM, PollCandSqls } from "@/models/PollCand";
import type { GetPollCandOptionT } from "@/types/PollCand";

export function lookupBuilder(select: any[], opt: GetPollCandOptionT): void {
  const sqls = new PollCandSqls(pollCandM.table);

  if (opt.$num_vote) {
    select.push(sqls.numVote());
  }
  if (opt.$my_vote && opt.userId) {
    select.push(sqls.myVote(opt.userId));
  }

}