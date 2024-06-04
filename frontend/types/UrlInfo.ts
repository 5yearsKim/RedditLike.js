export type UrlInfoFormT = {
    url: string;
    title: string | null;
    description: string | null;
    image: string | null;
    sitename: string | null;
    hostname: string | null;
}

export type UrlInfoT = {
    id: number;
    created_at: Date;
    updated_at?: Date | undefined;
    url: string;
    title: string | null;
    description: string | null;
    image: string | null;
    sitename: string | null;
    hostname: string | null;
}
