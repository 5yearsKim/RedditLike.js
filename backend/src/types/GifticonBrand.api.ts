import type { GifticonBrandT, ListGifticonBrandOptionT } from "./GifticonBrand";

// (GET) /
export type ListRqs = ListGifticonBrandOptionT
export type ListRsp = ListData<GifticonBrandT>

// (POST) /refresh
export type RefreshRqs = null
export type RefreshRsp = null