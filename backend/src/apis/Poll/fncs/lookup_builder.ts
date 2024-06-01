import { PollSqls, pollM } from "@/models/Poll";
import type { GetPollOptionT } from "@/types/Poll";


export function lookupBuilder(select: any[], opt: GetPollOptionT): void {
  const sqls = new PollSqls(pollM.table);
  if (opt.$cands) {
    select.push(sqls.cands());
  }
}