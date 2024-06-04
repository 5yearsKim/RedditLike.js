export type PostCheckFormT = {
    post_id: number;
    user_id?: (number | null) | undefined;
    ip_addr?: (string | null) | undefined;
    is_dummy?: (boolean | null) | undefined;
}

export type PostCheckT = {
    id: number;
    created_at: Date;
    updated_at?: Date | undefined;
    post_id: number;
    user_id?: (number | null) | undefined;
    ip_addr?: (string | null) | undefined;
    is_dummy?: (boolean | null) | undefined;
}
