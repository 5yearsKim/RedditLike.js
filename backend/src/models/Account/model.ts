import { DataModel, SqlInjector } from "@/utils/orm";
import type { AccountFormT, AccountT } from "@/types/Account";


const table = "accounts";
export const accountM = new DataModel<AccountFormT, AccountT>(table);


export class AccountSqls extends SqlInjector {
  constructor() {
    super(table);
  }
}

