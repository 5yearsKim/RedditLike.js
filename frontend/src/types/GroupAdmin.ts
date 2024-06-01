export type GroupAdminFormT = {
    user_id: number;
    group_id: number;
    is_super?: boolean | undefined;
    manage_admin?: boolean | undefined;
    manage_member?: boolean | undefined;
    manage_censor?: boolean | undefined;
    manage_intro?: boolean | undefined;
    manage_category?: boolean | undefined;
    manage_muter?: boolean | undefined;
}

type _GroupAdminT = {
    id: number;
    created_at: Date;
    updated_at?: Date | undefined;
    user_id: number;
    group_id: number;
    is_super: boolean;
    manage_admin: boolean;
    manage_member: boolean;
    manage_censor: boolean;
    manage_intro: boolean;
    manage_category: boolean;
    manage_muter: boolean;
}

export type GetGroupAdminOptionT = {
    userId?: (number | undefined) | undefined;
    groupId?: (number | undefined) | undefined;
    $user?: boolean | undefined;
    $account?: boolean | undefined;
}

export type ListGroupAdminOptionT = {
    userId?: ((number | undefined) | undefined) | undefined;
    groupId?: ((number | undefined) | undefined) | undefined;
    $user?: (boolean | undefined) | undefined;
    $account?: (boolean | undefined) | undefined;
}


// @type-gen remain
import { UserT } from "./User";
import { AccountT } from "./Account";

export interface GroupAdminT extends _GroupAdminT {
  user?: UserT;
  account?: AccountT;
}