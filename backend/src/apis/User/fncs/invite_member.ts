// import { userM } from "@/models/User";
// import { accountM } from "@/models/Account";
// import { genUniqueId } from "@/utils/random";
// import * as err from "@/errors";
// import type { AccountT, AccountFormT, UserT } from "@/types";


// async function findOrCreateAccount(email: string): Promise<AccountT> {
//   const fetched = await accountM.findOne({ email });
//   // if not exist, create account
//   if (!fetched) {
//     const sub = `user_${genUniqueId({ len: 8 })}`;
//     const form: AccountFormT = {
//       sub,
//       email,
//     };
//     const created = await accountM.create(form);
//     if (!created) {
//       throw new err.NotAppliedE("not created");
//     }
//     return created;
//   }
//   else {
//     return fetched;
//   }
// }


// export async function inviteMember(groupId: idT, email: string): Promise<UserT> {
//   const account = await findOrCreateAccount(email);

//   const fetched = await userM.findOne({ account_id: account.id, group_id: groupId });

//   if (fetched) {
//     throw new err.AlreadyExistE("user already member");
//   }
//   const created = await userM.create({
//     account_id: account.id,
//     group_id: groupId,
//   });
//   if (!created) {
//     throw new err.NotAppliedE("not created");
//   }

//   // TODO: send invitation email to user

//   return created;


// }