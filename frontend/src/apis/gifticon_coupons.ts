import { server } from "@/system/server";
import * as R from "@/types/GifticonCoupon.api";
import type { ListGifticonCouponOptionT } from "@/types/GifticonCoupon";

const root = "/gifticon-coupons";

export async function list(listOpt: ListGifticonCouponOptionT): Promise<R.ListRsp> {
  const params: R.ListRqs = listOpt;
  const rsp = await server.get(`${root}`, { params });
  return rsp.data;
}


export async function fetch(couponId: idT): Promise<R.FetchRsp> {
  const params: R.FetchRqs = { couponId };
  const rsp = await server.post(`${root}/fetch`, params);
  return rsp.data;
}

export async function cancel(couponId: idT): Promise<R.CancelRsp> {
  const params: R.CancelRqs = { couponId };
  const rsp = await server.post(`${root}/cancel`, params);
  return rsp.data;
}

export async function issue(productId: idT, receiverPhone: string|undefined = undefined): Promise<R.IssueRsp> {
  const params: R.IssueRqs = { productId, receiverPhone };
  const rsp = await server.post(`${root}/issue`, params);
  return rsp.data;
}