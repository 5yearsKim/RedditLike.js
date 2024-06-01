export type GroupProtectionT = "public" | "protected" | "private"

export type GroupFormT = {
    key: string;
    name: string;
    short_name?: (string | null) | undefined;
    avatar_path?: (string | null) | undefined;
    description?: (string | null) | undefined;
    protection: "public" | "protected" | "private";
    theme_color?: (string | null) | undefined;
    deleted_at?: (Date | null) | undefined;
    use_point?: boolean | undefined;
    allow_create_board?: boolean | undefined;
    locale?: (string | null) | undefined;
}

type _GroupT = {
    id: number;
    created_at: Date;
    updated_at?: Date | undefined;
    key: string;
    name: string;
    short_name?: (string | null) | undefined;
    avatar_path?: (string | null) | undefined;
    description?: (string | null) | undefined;
    protection: "public" | "protected" | "private";
    theme_color?: (string | null) | undefined;
    deleted_at?: (Date | null) | undefined;
    use_point?: boolean | undefined;
    allow_create_board?: boolean | undefined;
    locale?: (string | null) | undefined;
}

export type GetGroupOptionT = {
    accountId?: number | undefined;
    $admin?: boolean | undefined;
}

export type ListGroupOptionT = {
    accountId?: (number | undefined) | undefined;
    $admin?: (boolean | undefined) | undefined;
    limit?: number | undefined;
    cursor?: string | undefined;
    joined?: ("except" | "only") | undefined;
    admining?: ("except" | "only") | undefined;
    sort?: ("recent" | "old") | undefined;
}


// @type-gen remain
import { GroupAdminT } from "./GroupAdmin";

export interface GroupT extends _GroupT {
  admin?: GroupAdminT|null
}