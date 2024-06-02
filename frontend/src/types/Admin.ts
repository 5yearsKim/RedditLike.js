export type AdminFormT = {
    user_id: number;
    is_super?: boolean | undefined;
    manage_admin?: boolean | undefined;
    manage_member?: boolean | undefined;
    manage_censor?: boolean | undefined;
    manage_intro?: boolean | undefined;
    manage_category?: boolean | undefined;
    manage_muter?: boolean | undefined;
}

type _AdminT = {
    id: number;
    created_at: Date;
    updated_at?: Date | undefined;
    user_id: number;
    is_super: boolean;
    manage_admin: boolean;
    manage_member: boolean;
    manage_censor: boolean;
    manage_intro: boolean;
    manage_category: boolean;
    manage_muter: boolean;
}

export type GetAdminOptionT = {
    userId?: (number | undefined) | undefined;
    $user?: boolean | undefined;
}

export type ListAdminOptionT = {
    userId?: ((number | undefined) | undefined) | undefined;
    $user?: (boolean | undefined) | undefined;
}


// @type-gen remain
import { UserT } from "./User";


export interface AdminT extends _AdminT {
  user?: UserT|null
}