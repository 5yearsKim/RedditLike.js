import { useEffect } from "react";
import {
  SendMessageArgT,
  ReceiveMessageArgT,
  Room$WatchArgT,
  Room$UnwatchArgT,
  Room$CheckArgT,
  Room$ReceiveMessageArgT,
  Room$UpdateArgT,
  Room$GetClientNumArgT,
} from "@/types/Chat.socket";
import { socket } from "@/system/socket";
import { receiveMessageEv, room$receiveMessageEv, room$updateEv, room$getClientNumEv } from "@/system/global_events";
import type { ChatMessageFormT, ChatRoomT } from "@/types";

export function emitSendMessage(requestId: string, form: ChatMessageFormT): void {
  const arg: SendMessageArgT = { requestId, form };
  socket.emit("send-message", arg);
}

export function emitWatchRoom(chatRoom: ChatRoomT): void {
  const arg: Room$WatchArgT = { chatRoom };
  socket.emit("room/watch", arg);
}

export function emitUnwatchRoom(chatRoom: ChatRoomT): void {
  const arg: Room$UnwatchArgT = { chatRoom };
  socket.emit("room/unwatch", arg);
}

export function emitCheckRoom(chatRoom: ChatRoomT): void {
  const arg: Room$CheckArgT = { chatRoom };
  socket.emit("room/check", arg);
}


export function useChatSocketListener(isConnected: boolean) {
  useEffect(() => {
    if (!isConnected) {
      return;
    }

    function onReceiveMessage(arg: ReceiveMessageArgT): void {
      // console.log('onReceiveMessage', arg);
      receiveMessageEv.emit(arg);
    }

    function onRoom$ReceiveMessage(arg: Room$ReceiveMessageArgT): void {
      // console.log('onRoomReceiveMessage', arg);
      room$receiveMessageEv.emit(arg);
    }

    function onRoom$Update(arg: Room$UpdateArgT): void {
      // console.log('onRoomUpdate, ', arg);
      room$updateEv.emit(arg);
    }

    function onRoom$GetClientNum(arg: Room$GetClientNumArgT): void {
      // console.log('on Room client num:', arg);
      room$getClientNumEv.emit(arg);
    }

    socket.on("receive-message", onReceiveMessage);
    socket.on("room/receive-message", onRoom$ReceiveMessage);
    socket.on("room/update", onRoom$Update);
    socket.on("room/get-client-num", onRoom$GetClientNum);
    return (): void => {
      socket.off("receive-message", onReceiveMessage);
      socket.off("room/receive-message", onRoom$ReceiveMessage);
      socket.off("room/update", onRoom$Update);
      socket.off("room/get-client-num", onRoom$GetClientNum);
    };
  }, [isConnected]);
}
