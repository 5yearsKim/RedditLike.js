import type { UserSessionT } from "./Auth";


// (POST) /google-login
export type GoogleLoginRqs = {
  googleAccessToken: string;
};
export type GoogleLoginRsp = UserSessionT

// (POST) /email-login
export type EmailLoginRqs = {
  email: string;
  code: string;
};
export type EmailLoginRsp = UserSessionT

// (POST) /fake-login
export type FakeLoginRqs = {
  email: string;
};
export type FakeLoginRsp = UserSessionT

// (POST) /refresh
export type RefreshRqs = null;
export type RefreshRsp = UserSessionT
