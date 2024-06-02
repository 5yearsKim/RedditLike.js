// "use client";

// import { atom, useRecoilValue, useSetRecoilState } from "recoil";
// import * as AuthApi from "@/apis/auth";
// import { accountTH, userTH } from "@/system/token_holders";
// import { AccountT, AccountSessionT } from "@/types";


// type AccountDataT = {
//   account: AccountT
// }

// type AccountStateT = {
//   status: AuthStatusT
//   data?: AccountDataT
// }


// export const accountState = atom<AccountStateT>({
//   key: "accountState",
//   default: {
//     status: "init",
//     data: undefined,
//   },
// });

// export function useAccount(): AccountT|null {
//   const account$ = useRecoilValue(accountState);
//   return account$.data?.account ?? null;
// }

// export function useAccount$() {
//   const account$ = useRecoilValue(accountState);
//   return account$;
// }

// export function useAccountActions() {
//   const set = useSetRecoilState(accountState);


//   function patch(val: Partial<AccountStateT>) {
//     set((prev) => ({ ...prev, ...val }));
//   }

//   function patchData(newData: Partial<AccountDataT>): void {
//     set((prev) => ({ ...prev, data: prev.data ? { ...prev.data, ...newData } : undefined }));
//   }

//   function reset() {
//     set({
//       status: "loggedOut",
//       data: undefined,
//     });
//   }

//   async function loadFromSession(session: AccountSessionT): Promise<void> {
//     const { accessToken, accessTokenExpAt, account } = session;

//     accountTH.set({
//       token: accessToken,
//       expiresAt: accessTokenExpAt,
//       meta: {
//         account: account,
//       },
//     });
//     set({ status: "loggedIn", data: { account } });
//   }

//   async function refreshAccount(opt: {skipLoading?: boolean} = {}): Promise<void> {
//     try {
//       if (opt.skipLoading !== true) {
//         patch({ status: "loading" });
//       }
//       const session = await AuthApi.refresh();
//       loadFromSession(session);
//     } catch (e) {
//       console.warn("account refresh error:", e);
//       set({ status: "loggedOut", data: undefined });
//       accountTH.reset();
//       userTH.reset();
//     }
//   }

//   function logout(): void {
//     accountTH.reset();
//     userTH.reset();
//     reset();
//   }

//   return {
//     set,
//     patch,
//     patchData,
//     reset,
//     loadFromSession,
//     refreshAccount,
//     logout,
//   };
// }