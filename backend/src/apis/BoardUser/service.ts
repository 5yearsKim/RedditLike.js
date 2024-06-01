import { Injectable } from "@nestjs/common";
import * as err from "@/errors";
import type { AuthorT } from "@/types";
import { knex } from "@/global/db";
import { createSignedUrl, addDevOnKey } from "@/utils/s3";
import * as mime from "mime-types";
import { boardUserM, BoardUserSqls } from "@/models/BoardUser";
import type { ListBoardUserOptionT, BoardUserT, BoardUserFormT } from "@/types";


@Injectable()
export class BoardUserService {
  constructor() {}

  async getAuthor(userId: idT, boardId: idT): Promise<AuthorT|null> {

    const fetched = await knex.column(knex.raw(`get_author('${userId}', '${boardId}') as author`));

    if (fetched.length == 0 || !fetched[0].author) return null;

    return fetched[0].author;
  }

  async getOrCreateUser(userId: idT, boardId: idT): Promise<BoardUserT> {
    let user = await boardUserM.findOne({ user_id: userId, board_id: boardId });
    if (!user) {
      const form: BoardUserFormT = {
        user_id: userId,
        board_id: boardId,
      };
      user = await boardUserM.create(form);
    }
    if (!user) {
      throw new err.NotAppliedE();
    }
    return user;
  }

  // upsert
  async create(form: BoardUserFormT): Promise<BoardUserT> {
    const created = await boardUserM.upsert(form, { onConflict: ["board_id", "user_id"] });
    if (!created) {
      throw new err.NotAppliedE();
    }
    return created;
  }


  async list(listOpt: ListBoardUserOptionT): Promise<ListData<BoardUserT>> {
    const opt = listOpt;
    const sqls = new BoardUserSqls(boardUserM.table);
    const fetched = await boardUserM.find({
      builder: (qb, select) => {
        if (opt.$author) {
          select.push(sqls.author());
        }
        if (opt.nickname) {
          qb.whereRaw(`nickname LIKE '%${opt.nickname}%'`);
        }
        if (opt.boardId) {
          qb.whereRaw(`board_id = ${opt.boardId}`);
        }
        if (opt.userId) {
          qb.whereRaw(`user_id = ${opt.userId}`);
        }
      }
    });
    return { data: fetched, nextCursor: null };
  }

  async checkNicknameUnique(boardId: idT, nickname: string): Promise<boolean> {
    const fetched = await boardUserM.find({
      builder: (qb) => {
        qb.where({ board_id: boardId, nickname: nickname });
      }
    });
    return fetched.length === 0;
  }

  async getAvatarPresingedUrl(userId: idT, boardId: idT, mimeType: string) {
    let key = `boards/${boardId}/users/${userId}/avatar_${new Date().getTime()}.${mime.extension(mimeType)}`;
    key = addDevOnKey(key);
    const putUrl = await createSignedUrl(key, mimeType);
    return { putUrl, key };
  }
}