import { Socket } from "socket.io";
import * as err from "@/errors";

import { chatRoomM, ChatRoomSqls } from "@/models/ChatRoom";
import { chatUserM } from "@/models/ChatUser";
import { chatMessageM, ChatMessageSqls } from "@/models/ChatMessage";
import { io } from "@/sockets/global";
// import { forwardChatFcm } from "./utils";
import { toRoomId } from "../utils";
import {
  SendMessageArgT, ReceiveMessageArgT, Room$ReceiveMessageArgT,
  Room$WatchArgT, Room$UnwatchArgT, Room$CheckArgT, Room$UpdateArgT, Room$GetClientNumArgT,
} from "@/types/Chat.socket";


export function runChatSocket(socket: Socket): void {

  socket.on("room/watch", async (arg: Room$WatchArgT) => {
    const uid = socket.userId!;
    const { chatRoom } = arg;
    try {

      socket.join(toRoomId(chatRoom.id,"chatRoom"));

      await chatUserM.updateOne({ user_id: uid, room_id: chatRoom.id }, { last_checked_at: "NOW()" as any });

      const newChatRoom = await chatRoomM.findById(chatRoom.id, {
        builder: (qb, select) => {
          const sqls = new ChatRoomSqls(chatRoomM.table);
          select.push(sqls.participants());
        }
      });
      if (!newChatRoom) {
        throw new err.NotExistE();
      }

      const roomUpdateArg: Room$UpdateArgT = { chatRoom: newChatRoom };
      const roomId = toRoomId(chatRoom.id, "chatRoom");
      io.to(roomId).emit("room/update", roomUpdateArg);

      const clientIds = await io.of("/").in(roomId).fetchSockets();
      const clientNumArg: Room$GetClientNumArgT = { chatRoom, clientNum: clientIds.length };

      io.to(roomId).emit("room/get-client-num", clientNumArg);
    } catch (e) {
      console.warn(e);
    }
  });

  socket.on("room/unwatch", async (arg: Room$UnwatchArgT) => {
    const { chatRoom } = arg;
    try {
      const roomId = toRoomId(chatRoom.id, "chatRoom");
      socket.leave(roomId);

      const clientIds = await io.of("/").in(roomId).fetchSockets();
      const clientNumArg: Room$GetClientNumArgT = { chatRoom, clientNum: clientIds.length };
      io.to(roomId).emit("room/get-client-num", clientNumArg);
    } catch(e) {
      console.warn(e);
    }
  });

  socket.on("room/check", async (arg: Room$CheckArgT) => {
    const uid = socket.userId!;
    const { chatRoom } = arg;
    try {
      await chatUserM.updateOne({ user_id: uid, room_id: chatRoom.id }, { last_checked_at: "NOW()" as any });
      const newChatRoom = await chatRoomM.findById(chatRoom.id, {
        builder: (qb, select) => {
          const sqls = new ChatRoomSqls(chatRoomM.table);
          select.push(sqls.participants());
        }
      });
      if (!newChatRoom) {
        throw new err.NotExistE();
      }
      const roomUpdateArg: Room$UpdateArgT = { chatRoom: newChatRoom };
      io.to(toRoomId(chatRoom.id, "chatRoom")).emit("room/update", roomUpdateArg);
    } catch (e) {
      console.warn(e);
    }
  });


  // receive a message from the client
  socket.on("send-message", async (arg: SendMessageArgT): Promise<void> => {
    const uid = socket.userId!;
    try {
      const { requestId, form } = arg;

      const chatRoom = await chatRoomM.findById(form.room_id, {
        builder: (qb, select) => {
          const sqls = new ChatRoomSqls(chatRoomM.table);
          select.push(sqls.participants());
        }
      });

      if (!chatRoom) {
        throw new err.NotExistE("chatroom not exists");
      }
      // if private -> check if user is participant
      if (!chatRoom.is_public) {
        const isParticipant = chatRoom.participants?.some((item) => item.user_id == uid);
        if (!isParticipant) {
          throw new err.ForbiddenE("not participant");
        }
      }


      const created = await chatMessageM.create(form);
      await chatRoomM.updateOne({ id: chatRoom.id }, { last_message_at: "NOW()" as any });

      const message = await chatMessageM.findById(created!.id, {
        builder: (qb, select) => {
          const sqls = new ChatMessageSqls(chatMessageM.table);
          select.push(sqls.sender());
        }
      });

      if (!message) {
        throw new err.NotAppliedE();
      }

      // emit to chatroom
      const roomArg: Room$ReceiveMessageArgT = { requestId, message, chatRoom };
      io.to(toRoomId(chatRoom.id, "chatRoom")).emit("room/receive-message", roomArg);

      // emit to users
      if (!chatRoom.is_public) {
        await chatUserM.updateOne({ "room_id": chatRoom.id, "user_id": uid }, { last_checked_at: "NOW()" as any });

        const arg: ReceiveMessageArgT = { requestId, message, chatRoom };
        const participantIds = chatRoom.participants?.map((item) => toRoomId(item.user_id, "user")) ?? [];
        io.to(participantIds).emit("receive-message", arg);

        // const pushReceiverIds = chatRoom.participants?.map((item) => item.user_id).filter((pid) => pid !== uid) ?? [];
        // forwardChatFcm(pushReceiverIds, message)
        //   .catch((e) => console.warn("chat fcm error:", e));
      }
    } catch (e) {
      console.warn(e);
    }
  });
}

