export type GifticonCouponFormT = {
    user_id: number | null;
    product_id: number;
    coupon_code: string;
    used_points: number;
    receiver_phone?: (string | null) | undefined;
    giftishow_data?: any;
    last_giftishow_status?: (string | null) | undefined;
    is_cancelled: boolean;
}

type _GifticonCouponT = {
    id: number;
    created_at: Date;
    updated_at?: Date | undefined;
    user_id: number | null;
    product_id: number;
    coupon_code: string;
    used_points: number;
    receiver_phone?: (string | null) | undefined;
    giftishow_data?: any;
    last_giftishow_status?: (string | null) | undefined;
    is_cancelled: boolean;
}

export type GetGifticonCouponOptionT = {
    userId?: (number | undefined) | undefined;
    groupId?: (number | undefined) | undefined;
    $product?: boolean | undefined;
}

export type ListGifticonCouponOptionT = {
    userId?: ((number | undefined) | undefined) | undefined;
    groupId?: ((number | undefined) | undefined) | undefined;
    $product?: (boolean | undefined) | undefined;
    limit?: number | undefined;
    cursor?: string | undefined;
    usable?: ("only" | "except") | undefined;
}


// @type-gen remain
import { GifticonProductT } from "./GifticonProduct";

export interface GifticonCouponT extends _GifticonCouponT {
  product?: GifticonProductT
}