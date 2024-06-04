export type CategoryFormT = {
    label: string;
    parent_id?: (number | null) | undefined;
    rank?: (number | null) | undefined;
}

type _CategoryT = {
    id: number;
    created_at: Date;
    updated_at?: Date | undefined;
    label: string;
    parent_id?: (number | null) | undefined;
    rank?: (number | null) | undefined;
}

export type GetCategoryOptionT = {
    userId?: (number | undefined) | undefined;
    $my_like?: boolean | undefined;
}

export type ListCategoryOptionT = {
    userId?: ((number | undefined) | undefined) | undefined;
    $my_like?: (boolean | undefined) | undefined;
    boardId?: number | undefined;
}


// @type-gen remain
export interface CategoryT extends _CategoryT {
  my_like?: boolean;
}