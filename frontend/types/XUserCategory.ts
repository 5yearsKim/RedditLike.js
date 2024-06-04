export type XUserCategoryFormT = {
    category_id: number;
    user_id: number;
}

export type XUserCategoryT = {
    id: number;
    created_at: Date;
    updated_at?: Date | undefined;
    category_id: number;
    user_id: number;
}
