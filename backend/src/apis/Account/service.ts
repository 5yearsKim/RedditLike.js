import { Injectable } from "@nestjs/common";
import type { AccountT, AccountFormT } from "@/types/Account";
import { accountM } from "@/models/Account";
import * as err from "@/errors";


@Injectable()
export class AccountService {

  async create(form: AccountFormT): Promise<AccountT> {
    const created = await accountM.create(form);
    if (!created) {
      throw new err.NotAppliedE("not created");
    }
    return created;
  }

  async list(): Promise<AccountT[]> {
    const fetched = await accountM.find();
    return fetched;
  }
}


