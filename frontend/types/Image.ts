export type ImageFormT = {
    host?: (string | null) | undefined;
    path: string;
    mime_type?: (string | null) | undefined;
    width?: (number | null) | undefined;
    height?: (number | null) | undefined;
}

export type ImageT = {
    id: number;
    created_at: Date;
    updated_at?: Date | undefined;
    host?: (string | null) | undefined;
    path: string;
    mime_type?: (string | null) | undefined;
    width?: (number | null) | undefined;
    height?: (number | null) | undefined;
}
