export type UserFormT = {
    account_id: number;
    group_id: number;
    deleted_at?: (Date | null) | undefined;
    last_login_at?: (Date | null) | undefined;
    points?: number | undefined;
    notify_comment_on_comment?: boolean | undefined;
    notify_comment_on_post?: boolean | undefined;
    notify_trash_post?: boolean | undefined;
    notify_trash_comment?: boolean | undefined;
    allow_chat_push?: boolean | undefined;
}

type _UserT = {
    id: number;
    created_at: Date;
    updated_at?: Date | undefined;
    account_id: number;
    group_id: number;
    deleted_at?: (Date | null) | undefined;
    last_login_at?: (Date | null) | undefined;
    points: number;
    notify_comment_on_comment: boolean;
    notify_comment_on_post: boolean;
    notify_trash_post: boolean;
    notify_trash_comment: boolean;
    allow_chat_push: boolean;
}

export type GetUserOptionT = {
    userId?: (number | undefined) | undefined;
    groupId?: (number | undefined) | undefined;
    $account?: boolean | undefined;
}

export type ListUserOptionT = {
    userId?: ((number | undefined) | undefined) | undefined;
    groupId?: ((number | undefined) | undefined) | undefined;
    $account?: (boolean | undefined) | undefined;
    cursor?: string | undefined;
    limit?: number | undefined;
    sort?: ("recent" | "old") | undefined;
    search?: string | undefined;
}

export type UserSessionT = {
    user: {
        id: number;
        created_at: Date;
        updated_at?: Date | undefined;
        account_id: number;
        group_id: number;
        deleted_at?: (Date | null) | undefined;
        last_login_at?: (Date | null) | undefined;
        points: number;
        notify_comment_on_comment: boolean;
        notify_comment_on_post: boolean;
        notify_trash_post: boolean;
        notify_trash_comment: boolean;
        allow_chat_push: boolean;
    };
    token: string;
    tokenExpAt: number;
}


// @type-gen remain
import { AccountT } from "./Account";

export interface UserT extends _UserT {
  account?: AccountT
}