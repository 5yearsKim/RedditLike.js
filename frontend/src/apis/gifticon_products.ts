import { server } from "@/system/server";
import * as R from "@/types/GifticonProduct.api";
import type { ListGifticonProductOptionT } from "@/types";

const root = "/gifticon-products";

export async function list(listOpt: ListGifticonProductOptionT): Promise<R.ListRsp> {
  const params: R.ListRqs = listOpt;
  const rsp = await server.get(`${root}`, { params });
  return rsp.data;
}


