import type { AccountSessionT } from "./Auth";


// (POST) /google-login
export type GoogleLoginRqs = {
  googleAccessToken: string;
};
export type GoogleLoginRsp = AccountSessionT

// (POST) /email-login
export type EmailLoginRqs = {
  email: string;
  code: string;
};
export type EmailLoginRsp = AccountSessionT

// (POST) /fake-login
export type FakeLoginRqs = {
  email: string;
};
export type FakeLoginRsp = AccountSessionT

// (POST) /refresh
export type RefreshRqs = null;
export type RefreshRsp = AccountSessionT

// (POST) /verify-account-token
export type VerifyAccountTokenRqs = { accountToken: string };
export type VerifyAccountTokenRsp = AccountSessionT