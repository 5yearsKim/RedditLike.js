import type { AccountFormT, AccountT, GetAccountOptionT } from "./Account";

// create
export type CreateRqs = {form: AccountFormT}
export type CreateRsp = AccountT

// list
export type ListRqs = GetAccountOptionT
export type ListRsp = ListData<AccountT>


