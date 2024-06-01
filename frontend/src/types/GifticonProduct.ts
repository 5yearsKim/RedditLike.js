export type GiftishowProductT = {
    discountRate: number;
    mdCode: string;
    endDate: string;
    discountPrice: number;
    mmsGoodsImg: string;
    srchKeyword: string;
    limitDay: number;
    content: string;
    goodsImgB: string;
    goodsTypeNm: string;
    validPrdDay: string;
    goodsComName: string;
    goodsName: string;
    goodsStateCd: string;
    brandCode: string;
    goodsNo: number;
    brandName: string;
    salePrice: number;
    brandIconImg: string;
    goodsComId: string;
    goodsCode: string;
    goodsTypeDtlNm: string;
    category1Seq: number;
    goodsImgS: string;
    affiliate: string;
    realPrice: number;
}

export type GifticonProductFormT = {
    product_code: string;
    brand_code?: (string | null) | undefined;
    product_name: string;
    search_keywords?: (string | null) | undefined;
    real_price: number;
    discount_price: number;
    data: {
        discountRate: number;
        mdCode: string;
        endDate: string;
        discountPrice: number;
        mmsGoodsImg: string;
        srchKeyword: string;
        limitDay: number;
        content: string;
        goodsImgB: string;
        goodsTypeNm: string;
        validPrdDay: string;
        goodsComName: string;
        goodsName: string;
        goodsStateCd: string;
        brandCode: string;
        goodsNo: number;
        brandName: string;
        salePrice: number;
        brandIconImg: string;
        goodsComId: string;
        goodsCode: string;
        goodsTypeDtlNm: string;
        category1Seq: number;
        goodsImgS: string;
        affiliate: string;
        realPrice: number;
    };
    refreshed_at: Date;
    is_active: boolean;
}

export type GifticonProductT = {
    id: number;
    created_at: Date;
    updated_at?: Date | undefined;
    product_code: string;
    brand_code?: (string | null) | undefined;
    product_name: string;
    search_keywords?: (string | null) | undefined;
    real_price: number;
    discount_price: number;
    data: {
        discountRate: number;
        mdCode: string;
        endDate: string;
        discountPrice: number;
        mmsGoodsImg: string;
        srchKeyword: string;
        limitDay: number;
        content: string;
        goodsImgB: string;
        goodsTypeNm: string;
        validPrdDay: string;
        goodsComName: string;
        goodsName: string;
        goodsStateCd: string;
        brandCode: string;
        goodsNo: number;
        brandName: string;
        salePrice: number;
        brandIconImg: string;
        goodsComId: string;
        goodsCode: string;
        goodsTypeDtlNm: string;
        category1Seq: number;
        goodsImgS: string;
        affiliate: string;
        realPrice: number;
    };
    refreshed_at: Date;
    is_active: boolean;
}

export type GetGifticonProductOptionT = {
    userId?: (number | undefined) | undefined;
    groupId?: (number | undefined) | undefined;
}

export type ListGifticonProductOptionT = {
    userId?: ((number | undefined) | undefined) | undefined;
    groupId?: ((number | undefined) | undefined) | undefined;
    sort?: ("cheap" | "expensive" | "old") | undefined;
    limit?: number | undefined;
    cursor?: string | undefined;
    brandCode?: string | undefined;
    search?: string | undefined;
    maxPrice?: number | undefined;
    minPrice?: number | undefined;
}
