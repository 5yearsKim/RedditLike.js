export type XPostVideoFormT = {
    post_id: number;
    video_id: number;
    rank?: (number | null) | undefined;
}

export type XPostVideoT = {
    id: number;
    created_at: Date;
    updated_at?: Date | undefined;
    post_id: number;
    video_id: number;
    rank?: (number | null) | undefined;
}
