export type ChatRoomFormT = {
    board_id: number;
    is_public: boolean;
    last_message_at?: (Date | null) | undefined;
}

type _ChatRoomT = {
    id: number;
    created_at: Date;
    updated_at?: Date | undefined;
    board_id: number;
    is_public: boolean;
    last_message_at?: (Date | null) | undefined;
}

export type GetChatRoomOptionT = {
    userId?: (number | undefined) | undefined;
    $board?: boolean | undefined;
    $participants?: boolean | undefined;
    $last_message?: boolean | undefined;
    $opponent?: boolean | undefined;
    $unread_cnt?: boolean | undefined;
}

export type ListChatRoomOptionT = {
    userId?: ((number | undefined) | undefined) | undefined;
    $board?: (boolean | undefined) | undefined;
    $participants?: (boolean | undefined) | undefined;
    $last_message?: (boolean | undefined) | undefined;
    $opponent?: (boolean | undefined) | undefined;
    $unread_cnt?: (boolean | undefined) | undefined;
    limit?: number | undefined;
    cursor?: string | undefined;
    public?: ("except" | "only") | undefined;
    lastMessage?: ("except" | "only") | undefined;
    boardId?: number | undefined;
}


// @type-gen remain
import type { BoardT } from "@/types";
import type { ChatUserT } from "./ChatUser";
import type { ChatMessageT } from "./ChatMessage";
import type { AuthorT } from "./BoardUser";

export interface ChatRoomT extends _ChatRoomT {
  board?: BoardT
  participants?: ChatUserT[]
  last_message?: ChatMessageT
  opponent?: AuthorT|null
  unread_cnt?: number
}