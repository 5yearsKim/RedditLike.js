import { Injectable } from "@nestjs/common";
import * as err from "@/errors";
import { chatRoomM } from "@/models/ChatRoom";
import { chatUserM } from "@/models/ChatUser";
import { knex } from "@/global/db";
import { lookupBuilder } from "./fncs/lookup_builder";
import { listChatRoom } from "./fncs/list_chat_room";
import {
  ChatRoomFormT, ChatRoomT, GetChatRoomOptionT, ListChatRoomOptionT,
  ChatUserFormT,
} from "@/types";


@Injectable()
export class ChatRoomService {
  constructor() {}

  private async findByParticipantIds(boardId: idT, participantIds: idT[]): Promise<ChatRoomT|null> {
    const table = chatRoomM.table;
    const fetched = await chatRoomM.find({
      builder: (qb) => {
        qb
          .from(table)
          .join("chat_users AS cu", `${table}.id`, "=", "cu.room_id")
          .where(`${table}.board_id`, "=", boardId)
          .whereIn("cu.user_id", participantIds)
          .whereNull("cu.deleted_at")
          .groupBy(`${table}.id`)
          .havingRaw(`COUNT(DISTINCT cu.id) = ${participantIds.length}`);
      }
    });
    return fetched ? fetched[0] : null;
  }

  async get(id: idT, getOpt: GetChatRoomOptionT = {}): Promise<ChatRoomT> {
    const fetched = await chatRoomM.find({
      builder: (qb, select) => {
        qb.where("id", id);
        lookupBuilder(select, getOpt);
      }
    });
    if (!fetched) {
      throw new err.NotExistE(`chat room not found with id: ${id}`);
    }
    return fetched[0];
  }

  async create(form: ChatRoomFormT ): Promise<ChatRoomT> {
    const created = await chatRoomM.create(form);
    if (!created) {
      throw new err.NotAppliedE();
    }
    return created;
  }

  async list(listOpt: ListChatRoomOptionT): Promise<ListData<ChatRoomT>> {
    return await listChatRoom(listOpt);
  }


  async initBoardChat(boardId: idT): Promise<ChatRoomT> {
    const found = await chatRoomM.findOne({ board_id: boardId, is_public: true });
    if (found) {
      return found;
    }
    const created = await chatRoomM.create({ board_id: boardId, is_public: true });
    if (!created) {
      throw new err.NotAppliedE();
    }
    return created;
  }

  async initChat(boardId: idT, participantIds: idT[]): Promise<ChatRoomT> {
    const found = await this.findByParticipantIds(boardId, participantIds);
    if (found) {
      return found;
    }

    let created: ChatRoomT|null = null;
    await knex.transaction(async (trx) => {
      // chat room
      created = await chatRoomM.create({
        board_id: boardId,
        is_public: false,
      }, { trx });
      // chat users
      const userForms = participantIds.map<ChatUserFormT>((user_id) => ({
        user_id: user_id,
        room_id: created!.id,
      }));
      await chatUserM.createMany(userForms, { trx });
    });
    if (!created) {
      throw new err.NotAppliedE();
    }
    return created;
  }

  async leaveChat(userId: idT, roomId: idT): Promise<void> {
    await chatUserM.updateMany({ user_id: userId, room_id: roomId }, { deleted_at: "NOW()" as any });
  }
}