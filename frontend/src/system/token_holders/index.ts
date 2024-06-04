import { TokenHolder } from "./token_holder";

export const userTH = new TokenHolder({
  key: "userTokenHolder",
  saveCookie: true,
  // resetOnExpire: false,
});
