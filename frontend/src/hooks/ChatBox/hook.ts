import { atom, useRecoilState } from "recoil";
import { useUrlState } from "@/hooks/UrlState";
import { ChatRoomT } from "@/types";

const chatBoxState = atom<ChatRoomT | null>({
  key: "chatBoxState",
  default: null,
});

export function useChatBox() {
  // const [navbarDrawerOpen, setNavbarDrawerOpen] = useRecoilState(navbarDrawerState);

  const [chatBoxOpen, setChatBoxOpen] = useUrlState<boolean>({
    key: "chatBox",
    val2query: (val) => val ? "true" : null,
    query2val: (query) => query == "true",
    backOn: (val) => !val,
  });

  const [focusedRoom, setFocusedRoom] = useRecoilState(chatBoxState);


  function openChatBox(): void {
    if (chatBoxOpen) {
      return;
    }
    setChatBoxOpen(true);
  }

  function closeChatBox(): void {
    if (!chatBoxOpen) {
      return;
    }
    setChatBoxOpen(false);
  }

  return {
    chatBoxOpen,
    focusedRoom,
    setFocusedRoom,
    openChatBox,
    closeChatBox,
  };
}
