"use client";
import React, { ReactNode } from "react";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useMe } from "@/stores/UserStore";
import { useChatRoomsStore, getListChatRoomOption } from "@/stores/ChatRoomsStore";
import { useChatQueueActions } from "@/stores/ChatQueueStore";
import { receiveMessageEv, room$updateEv, refreshChatRoomsEv } from "@/system/global_events";
import * as ChatRoomApi from "@/apis/chat_rooms";

import { AuthorContainer } from "@/components/ChatMessageItem";
import { useChatBox } from "@/hooks/ChatBox/hook";
import { EllipsisTxt } from "@/ui/texts";
import type { ChatRoomT } from "@/types";

type ChatEventProviderProps = {
  children: ReactNode
}

export function ChatEventProvider({ children }: ChatEventProviderProps): ReactNode {
  const me = useMe();
  const chatQueueAct = useChatQueueActions();
  const { focusedRoom, setFocusedRoom, openChatBox } = useChatBox();
  const { data: chatRooms$, actions: chatRoomsAct } = useChatRoomsStore();

  const { data: chatRooms } = chatRooms$;

  const listOpt = getListChatRoomOption({ userId: me?.id });

  // init chatRooms
  useEffect(() => {
    if (me?.id) {
      chatRoomsAct.load(listOpt);
    }
  }, [me?.id]);

  // event: refreshChatRooms
  useEffect(() => {
    refreshChatRoomsEv.addListener("chatEventProvider", () => {
      chatRoomsAct.load(listOpt, { force: true, skipLoading: true });
    });
    return () => {
      refreshChatRoomsEv.removeListener("chatEventProvider");
    };
  }, [chatRooms$.data]);

  useEffect(() => {
    // event: receive-message
    receiveMessageEv.addListener("chatEventProvider", async (arg) => {
      const { requestId, message, chatRoom } = arg;

      if (chatRoom.is_public) {
        return;
      }
      if (chatRooms$.status !== "loaded") {
        return;
      }

      chatQueueAct.filterItem("sending", (item) => item.requestId !== requestId);

      const roomIdx = chatRooms.findIndex((item) => item.id == chatRoom.id);

      // toasting process
      if (message.sender_id !== me?.id && focusedRoom?.id !== chatRoom.id) {
        const msgItem = (
          <div
            onClick={async (): Promise<void> => {
              try {
                const { data: fetchedChatRoom } = await ChatRoomApi.get(chatRoom.id, listOpt);
                setFocusedRoom(fetchedChatRoom);
                openChatBox();
              } catch (e) {
                console.warn(e);
              }
            }}
          >
            <AuthorContainer
              isMine={false}
              hidden={false}
              isPublic={false}
              message={message}
            >
              <EllipsisTxt maxLines={2}>{message.body}</EllipsisTxt>
            </AuthorContainer>
          </div>
        );
        toast(msgItem, { theme: "colored", autoClose: 3000 });
      }

      // case room exists
      if (roomIdx >= 0) {
        const found = chatRooms[roomIdx];
        const newChatRooms = [...chatRooms];
        newChatRooms.splice(roomIdx, 1);
        const updatedRoom: ChatRoomT = {
          ...found,
          last_message: message,
          last_message_at: message.created_at,
          unread_cnt: Number.isInteger(found.unread_cnt) ? found.unread_cnt! + 1 : 0,
        };
        newChatRooms.splice(0, 0, updatedRoom);
        chatRoomsAct.patch({ data: newChatRooms });
      } else {
        // case room not exists
        try {
          const { data: fetched } = await ChatRoomApi.get(chatRoom.id, listOpt);
          const newChatRooms = [fetched, ...chatRooms];
          chatRoomsAct.patch({ data: newChatRooms });
        } catch (e) {
          console.warn(e);
        }
      }
    });

    // event: room/update
    // remove unreadCnt if exists
    room$updateEv.addListener("chatEventProvider", (arg) => {
      const { chatRoom } = arg;

      if (chatRoom.is_public) {
        return;
      }
      if (chatRooms$.status !== "loaded") {
        return;
      }

      const found = chatRooms.find((item) => item.id == chatRoom.id);
      if (!found) {
        return;
      }
      if (!found.unread_cnt) {
        return;
      }
      chatRoomsAct.replaceItem({ ...found, unread_cnt: 0 });
    });

    return () => {
      receiveMessageEv.removeListener("chatEventProvider");
      room$updateEv.removeListener("chatEventProvider");
    };
  }, [me?.id, chatRooms]);

  return children;
}