export type BoardUserFormT = {
    user_id: number;
    board_id: number;
    nickname?: (string | null) | undefined;
    avatar_path?: (string | null) | undefined;
}

type _BoardUserT = {
    id: number;
    created_at: Date;
    updated_at?: Date | undefined;
    user_id: number;
    board_id: number;
    nickname?: (string | null) | undefined;
    avatar_path?: (string | null) | undefined;
}

export type GetBoardUserOptionT = {
    userId?: (number | undefined) | undefined;
    groupId?: (number | undefined) | undefined;
    $author?: boolean | undefined;
}

export type ListBoardUserOptionT = {
    userId?: number | undefined;
    groupId?: ((number | undefined) | undefined) | undefined;
    $author?: (boolean | undefined) | undefined;
    boardId?: number | undefined;
    nickname?: string | undefined;
}

export type AuthorT = {
    id: number;
    board_id: number;
    default_nickname: string | null;
    default_avatar_path: string | null;
    use_flair: boolean;
    nickname: string | null;
    avatar_path: string | null;
    flairs: {
        id: number;
        created_at: Date;
        updated_at?: Date | undefined;
        box_id: number;
        label: string;
        text_color?: (string | null) | undefined;
        bg_color?: (string | null) | undefined;
        rank?: (number | null) | undefined;
        creator_id?: (number | null) | undefined;
        manager_only?: boolean | undefined;
    }[];
    is_manager: boolean;
    deleted_at: Date | null;
    temp_id: number;
}


// @type-gen remain
export interface BoardUserT extends _BoardUserT {
  author?: AuthorT | null;
}