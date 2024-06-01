export type FlairBoxFormT = {
    board_id: number;
    name: string;
    description?: (string | null) | undefined;
    is_editable?: boolean | undefined;
    is_multiple?: boolean | undefined;
    is_force?: boolean | undefined;
}

type _FlairBoxT = {
    id: number;
    created_at: Date;
    updated_at?: Date | undefined;
    board_id: number;
    name: string;
    description?: (string | null) | undefined;
    is_editable: boolean;
    is_multiple: boolean;
    is_force: boolean;
}

export type GetFlairBoxOptionT = {
    userId?: (number | undefined) | undefined;
    groupId?: (number | undefined) | undefined;
    $flairs?: boolean | undefined;
    $custom_flairs?: boolean | undefined;
}

export type ListFlairBoxOptionT = {
    userId?: ((number | undefined) | undefined) | undefined;
    groupId?: ((number | undefined) | undefined) | undefined;
    $flairs?: (boolean | undefined) | undefined;
    $custom_flairs?: (boolean | undefined) | undefined;
    boardId?: number | undefined;
}


// @type-gen remain
import { FlairT } from "./Flair";

export interface FlairBoxT extends _FlairBoxT {
  flairs?: FlairT[];
  custom_flairs?: FlairT[];
}