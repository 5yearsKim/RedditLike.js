import type { ListGifticonProductOptionT, GifticonProductT } from "./GifticonProduct";

// (POST) /refresh
export type RefreshRqs = null
export type RefreshRsp = null

// (GET) /
export type ListRqs = ListGifticonProductOptionT
export type ListRsp = ListData<GifticonProductT>