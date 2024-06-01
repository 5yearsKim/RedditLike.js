export type ChatUserFormT = {
    room_id: number;
    user_id: number;
    last_checked_at?: (Date | null) | undefined;
    deleted_at?: (Date | null) | undefined;
}

type _ChatUserT = {
    id: number;
    created_at: Date;
    updated_at?: Date | undefined;
    room_id: number;
    user_id: number;
    last_checked_at?: (Date | null) | undefined;
    deleted_at?: (Date | null) | undefined;
}

export type GetChatUserOptionT = {
    userId?: (number | undefined) | undefined;
    groupId?: (number | undefined) | undefined;
    $author?: boolean | undefined;
}

export type ListChatUserOptionT = {
    userId?: (number | undefined) | undefined;
    groupId?: (number | undefined) | undefined;
    $author?: boolean | undefined;
}


// @type-gen remain
import type { AuthorT } from "./BoardUser";

export interface ChatUserT extends _ChatUserT {
  author?: AuthorT|null
}