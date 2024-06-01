import { server } from "@/system/server";
import * as R from "@/types/UrlInfo.api";

const root = "/url-infos";


export async function inspect(url: string): Promise<R.InspectRsp> {
  const body: R.InspectRqs = { url };
  const rsp = await server.post(`${root}/inspect`, body );
  return rsp.data;
}