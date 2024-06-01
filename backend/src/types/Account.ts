export type AccountFormT = {
    /** provided by firebase */
    sub: string;
    email: string;
    deleted_at?: (Date | null) | undefined;
}

type _AccountT = {
    id: number;
    created_at: Date;
    updated_at?: Date | undefined;
    /** provided by firebase */
    sub: string;
    email: string;
    deleted_at?: (Date | null) | undefined;
}

export type GetAccountOptionT = {}

export type ListAccountOptionT = {}


// @type-gen remain
export interface AccountT extends _AccountT {}