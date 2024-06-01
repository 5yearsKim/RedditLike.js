import { useState, useEffect, useImperativeHandle, ForwardedRef } from "react";
import * as ChatMessageApi from "@/apis/chat_messages";
import { useListData } from "@/hooks/ListData";
import { useMe } from "@/stores/UserStore";
import { useChatQueue, useChatQueueActions, QueueItemT } from "@/stores/ChatQueueStore";
import { room$receiveMessageEv, room$updateEv } from "@/system/global_events";
import * as ChatSocket from "@/sockets/chat";
import { MessageListProps, MessageListT } from "./types";
// import {sleep} from '@/utils/misc'
import type { ChatRoomT, ChatMessageT, ListChatMessageOptionT } from "@/types";


function chatRoom2lastCheckAts(chatRoom: ChatRoomT): Date[] {
  return (chatRoom.participants ?? []).map((item) =>
    item.last_checked_at ? new Date(item.last_checked_at) : new Date(0),
  );
}

// eslint-disable-next-line
export function useLogic(props: MessageListProps, ref: ForwardedRef<MessageListT>) {
  const { socketKey, chatRoom, messageSize } = props;

  const isPublic = chatRoom.is_public ?? false;

  const { data: chatMessages$, actions: chatMessagesAct } = useListData<ChatMessageT, ListChatMessageOptionT>({
    listFn: ChatMessageApi.list,
  });
  const me = useMe();
  const chatQueue$ = useChatQueue();
  const chatQueueAct = useChatQueueActions();
  const [lastCheckAts, setLastCheckAts] = useState<Date[]>(isPublic ? [] : chatRoom2lastCheckAts(chatRoom));

  const listOpt: ListChatMessageOptionT = {
    roomId: chatRoom.id,
  };

  const sendingMsgs = chatQueue$.sending.filter((item) => item.form.room_id == chatRoom.id);
  const failedMsgs = chatQueue$.failed.filter((item) => item.form.room_id == chatRoom.id);

  useImperativeHandle(ref, () => ({
    refreshWithoutLoading: (): void => {
      chatMessagesAct.load(listOpt, { force: true, skipLoading: true });
    },
  }));

  // sending queue process
  useEffect(() => {
    if (sendingMsgs.length == 0) {
      return;
    }

    const newFailed = [...chatQueue$.failed];
    const newSending = [...chatQueue$.sending];

    for (let i = sendingMsgs.length - 1; i >= 0; i--) {
      const item = sendingMsgs[i];
      const diff = new Date().getTime() - item.requestedAt.getTime();
      if (diff > 1000) {
        newFailed.splice(0, 0, item);
        newSending.splice(i, 1);
      }
    }

    chatQueueAct.patch({
      sending: newSending,
      failed: newFailed,
    });
  }, []);

  // init message
  useEffect(() => {
    chatMessagesAct.load(listOpt);
  }, [listOpt.roomId]);

  const listenrKey = "messageList_" + socketKey;

  // room/receive-message
  useEffect(() => {
    room$receiveMessageEv.addListener(listenrKey, (arg) => {
      const { requestId, message, chatRoom: updatedChatRoom } = arg;
      if (updatedChatRoom.id !== chatRoom.id) {
        return;
      }
      // remove item from sending queue and push to message list
      chatMessagesAct.splice(0, 0, message);
      chatQueueAct.filterItem("sending", (item) => item.requestId !== requestId);

      if (!isPublic) {
        setLastCheckAts(chatRoom2lastCheckAts(updatedChatRoom));
        // notify check
        ChatSocket.emitCheckRoom(chatRoom);
      }
    });

    return (): void => {
      room$receiveMessageEv.removeListener(listenrKey);
    };
  }, [chatMessages$.data]);

  // room/update
  useEffect(() => {
    if (isPublic) {
      return; // public not applied
    }

    room$updateEv.addListener(listenrKey, (arg) => {
      const { chatRoom: updatedChatRoom } = arg;
      setLastCheckAts(chatRoom2lastCheckAts(updatedChatRoom));
    });
    return (): void => {
      room$updateEv.removeListener(listenrKey);
    };
  }, []);

  function handleErrorRetry(): void {
    chatMessagesAct.load(listOpt, { force: true });
  }

  function handleLoaderDetect(): void {
    chatMessagesAct.refill();
  }

  function handleAppendRetry(): void {
    chatMessagesAct.refill();
  }

  function handleErrorMessageRetryClick(msg: QueueItemT): void {
    chatQueueAct.filterItem("failed", (item) => item.requestId !== msg.requestId);
    ChatSocket.emitSendMessage(msg.requestId, msg.form);
    chatQueueAct.splice("sending", 0, 0, { ...msg, requestedAt: new Date() });
  }

  function handleErrorMessageCloseClick(msg: QueueItemT): void {
    chatQueueAct.filterItem("failed", (item) => item.requestId !== msg.requestId);
  }

  return {
    me,
    messageSize,
    isPublic,
    chatMessages$,
    sendingMsgs,
    failedMsgs,
    lastCheckAts,
    handleErrorRetry,
    handleLoaderDetect,
    handleAppendRetry,
    handleErrorMessageRetryClick,
    handleErrorMessageCloseClick,
  };
}
