import type { ChatRoomT } from "@/types";

export type MessageListT = {
  refreshWithoutLoading: () => void;
};

export type MessageListProps = {
  socketKey?: string; // should used when message list is used outside of chat room
  chatRoom: ChatRoomT;
  messageSize?: "small" | "medium";
};
