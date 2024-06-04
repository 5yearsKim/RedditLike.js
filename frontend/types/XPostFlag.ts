export type XPostFlagFormT = {
    flag_id: number;
    post_id: number;
    rank?: (number | null) | undefined;
}

export type XPostFlagT = {
    id: number;
    created_at: Date;
    updated_at?: Date | undefined;
    flag_id: number;
    post_id: number;
    rank?: (number | null) | undefined;
}
