export type VideoFormT = {
    host?: (string | null) | undefined;
    path: string;
    s_path?: (string | null) | undefined;
    thumb_path?: (string | null) | undefined;
    converted_at?: (Date | null) | undefined;
    mime_type?: (string | null) | undefined;
}

export type VideoT = {
    id: number;
    created_at: Date;
    updated_at?: Date | undefined;
    host?: (string | null) | undefined;
    path: string;
    s_path?: (string | null) | undefined;
    thumb_path?: (string | null) | undefined;
    converted_at?: (Date | null) | undefined;
    mime_type?: (string | null) | undefined;
}
