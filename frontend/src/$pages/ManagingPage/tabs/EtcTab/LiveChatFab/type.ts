import type { ChatRoomT, AuthorT } from "@/types";

export type LiveChatFabProps = {
  chatRoom: ChatRoomT;
  author?: AuthorT | null;
};

export type LiveChatFabT = {
  imperativeOpen: () => void;
};
