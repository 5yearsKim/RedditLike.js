export type ChatMessageFormT = {
    room_id: number;
    sender_id: number;
    body: string;
}

type _ChatMessageT = {
    id: number;
    created_at: Date;
    updated_at?: Date | undefined;
    room_id: number;
    sender_id: number;
    body: string;
}

export type GetChatMessageOptionT = {
    userId?: (number | undefined) | undefined;
    $sender?: boolean | undefined;
}

export type ListChatMessageOptionT = {
    userId?: ((number | undefined) | undefined) | undefined;
    $sender?: (boolean | undefined) | undefined;
    limit?: number | undefined;
    cursor?: string | undefined;
    roomId?: number | undefined;
}


// @type-gen remain
import type { AuthorT } from "./BoardUser";


export interface ChatMessageT extends _ChatMessageT {
  sender?: AuthorT|null
}