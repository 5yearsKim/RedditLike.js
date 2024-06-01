import { userM, UserSqls } from "@/models/User";
import { GetUserOptionT } from "@/types";

export function lookupBuilder(select: any[], opt: GetUserOptionT) {
  const sqls = new UserSqls(userM.table);
  if (opt.$account) {
    select.push(sqls.account());
  }
}