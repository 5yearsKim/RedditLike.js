import type { ListGifticonCouponOptionT, GifticonCouponT } from "./GifticonCoupon";

// (GET) /
export type ListRqs = ListGifticonCouponOptionT
export type ListRsp = ListData<GifticonCouponT>

// (POST) /issue
export type IssueRqs = {receiverPhone?: string, productId: number}
export type IssueRsp = GifticonCouponT

// (POST) /cancel
export type CancelRqs = {couponId: idT}
export type CancelRsp = GifticonCouponT

// (POST) /send-mms
export type SendMmsRqs = {couponId: idT}
export type SendMmsRsp = null

// (POST) /fetch
export type FetchRqs = {couponId: idT}
export type FetchRsp = {coupon: GifticonCouponT, giftishowInfo: any}