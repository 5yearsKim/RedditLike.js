import { TokenHolder } from "./token_holder";

export const accountTH = new TokenHolder({
  key: "accountTokenHolder",
  saveCookie: true,
  // resetOnExpire: false,
});
export const userTH = new TokenHolder({
  key: "userTokenHolder",
  saveCookie: true,
  // resetOnExpire: false,
});
