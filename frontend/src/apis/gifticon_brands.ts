import { server } from "@/system/server";
import * as R from "@/types/GifticonBrand.api";
import type { ListGifticonBrandOptionT } from "@/types";

const root = "/gifticon-brands";

export async function list(listOpt: ListGifticonBrandOptionT): Promise<R.ListRsp> {
  const params: R.ListRqs = listOpt;
  const rsp = await server.get(`${root}`, { params });
  return rsp.data;
}


