export type XPostImageFormT = {
    post_id: number;
    image_id: number;
    rank?: (number | null) | undefined;
}

export type XPostImageT = {
    id: number;
    created_at: Date;
    updated_at?: Date | undefined;
    post_id: number;
    image_id: number;
    rank?: (number | null) | undefined;
}
