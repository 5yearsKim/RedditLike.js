import * as R from "@/types/Auth.api";
import { server } from "@/system/server";

const root = "/auth";

export async function googleLogin(googleAccessToken: string): Promise<R.GoogleLoginRsp> {
  const body: R.GoogleLoginRqs = { googleAccessToken };
  const rsp = await server.post(`${root}/google-login`, body);
  return rsp.data;
}

export async function emailLogin(email: string, code: string): Promise<R.EmailLoginRsp> {
  const body: R.EmailLoginRqs = { email, code };
  const rsp = await server.post(`${root}/email-login`, body);
  return rsp.data;
}

export async function fakeLogin(email: string): Promise<R.FakeLoginRsp> {
  const body: R.FakeLoginRqs = { email };
  const rsp = await server.post(`${root}/fake-login`, body);
  return rsp.data;
}

export async function refresh(): Promise<R.RefreshRsp> {
  const rsp = await server.post(`${root}/refresh`);
  return rsp.data;
}

export async function verifyAccountToken(token: string): Promise<R.VerifyAccountTokenRsp> {
  const body: R.VerifyAccountTokenRqs = { accountToken: token };
  const rsp = await server.post(`${root}/verify-account-token`, body);
  return rsp.data;
}

export async function _root() {
  console.log(await server.get("/"));
}