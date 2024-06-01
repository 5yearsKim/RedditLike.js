export type GiftishowBrandT = {
    brandName: string;
    category1Name: string;
    content: string;
    brandBannerImg: string;
    brandIConImg: string;
    category2Name: string;
    brandCode: string;
}

export type GifticonBrandFormT = {
    brand_code: string;
    brand_name: string;
    category1?: (string | null) | undefined;
    category2?: (string | null) | undefined;
    data: {
        brandName: string;
        category1Name: string;
        content: string;
        brandBannerImg: string;
        brandIConImg: string;
        category2Name: string;
        brandCode: string;
    };
    refreshed_at: Date;
    is_active: boolean;
}

export type GifticonBrandT = {
    id: number;
    created_at: Date;
    updated_at?: Date | undefined;
    brand_code: string;
    brand_name: string;
    category1?: (string | null) | undefined;
    category2?: (string | null) | undefined;
    data: {
        brandName: string;
        category1Name: string;
        content: string;
        brandBannerImg: string;
        brandIConImg: string;
        category2Name: string;
        brandCode: string;
    };
    refreshed_at: Date;
    is_active: boolean;
}

export type GetGifticonBrandOptionT = {
    userId?: (number | undefined) | undefined;
    groupId?: (number | undefined) | undefined;
}

export type ListGifticonBrandOptionT = {
    userId?: ((number | undefined) | undefined) | undefined;
    groupId?: ((number | undefined) | undefined) | undefined;
    limit?: number | undefined;
    cursor?: string | undefined;
    search?: string | undefined;
    category?: string | undefined;
}
