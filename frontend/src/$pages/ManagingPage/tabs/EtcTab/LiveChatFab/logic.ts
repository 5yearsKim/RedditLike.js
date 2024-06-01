import { useState, useEffect, ForwardedRef, useImperativeHandle } from "react";
import { room$getClientNumEv } from "@/system/global_events";
import { useLoginAlertDialog } from "@/hooks/dialogs/ConfirmDialog";
import { useMe } from "@/stores/UserStore";
import type { LiveChatFabProps, LiveChatFabT } from "./type";


export function useLogic(props: LiveChatFabProps, ref: ForwardedRef<LiveChatFabT>) {
  const { chatRoom, author } = props;
  const me = useMe();

  const [chatOpen, setChatOpen] = useState<boolean>(false);

  const [clientNum, setClientNum] = useState<number | null>(null);

  const { showLoginAlertDialog } = useLoginAlertDialog();

  useImperativeHandle(ref, () => ({
    imperativeOpen: (): void => {
      handleClick();
    },
  }));

  useEffect(() => {
    const onHashChange = (): void => {
      if (window.location.hash !== "#public-chat") {
        setChatOpen(false);
      }
    };
    window.addEventListener("hashchange", onHashChange);
    return (): void => window.removeEventListener("hashchange", onHashChange);
  }, []);

  useEffect(() => {
    room$getClientNumEv.addListener("liveChatFab", (arg) => {
      if (arg.chatRoom.id == chatRoom.id) {
        setClientNum(arg.clientNum);
      }
    });
    return (): void => {
      room$getClientNumEv.removeListener("liveChatFab");
    };
  }, []);

  function handleClick(): void {
    if (!me) {
      showLoginAlertDialog();
      return;
    }
    setChatOpen(true);
    window.location.hash = "#public-chat";
  }

  function handleChatClose(): void {
    if (window.location.hash === "#public-chat") {
      window.history.back();
    } else {
      setChatOpen(false);
    }
  }

  return {
    chatRoom,
    author,
    chatOpen,
    clientNum,
    handleClick,
    handleChatClose,
  };
}
