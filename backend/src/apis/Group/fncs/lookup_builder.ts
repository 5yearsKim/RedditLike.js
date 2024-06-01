import { groupM, GroupSqls } from "@/models/Group";
import type { GetGroupOptionT } from "@/types";

export function lookupBuilder(select: any[], opt: GetGroupOptionT): void {
  const sqls = new GroupSqls(groupM.table);
  if (opt.$admin && opt.accountId) {
    select.push(sqls.admin(opt.accountId));
  }

}