import { server } from "@/system/server";
import * as R from "@/types/EmailVerification.api";
// import type { EmailVerificationT } from "@/types";

const root = "/email-verifications";


export async function request(email: string, emailOpt: {serviceName?:string, locale?: string} = {}): Promise<R.RequestRsp> {
  const body: R.RequestRqs = { email, emailOpt };
  const rsp = await server.post(`${root}/request`, body);
  return rsp.data;
}
