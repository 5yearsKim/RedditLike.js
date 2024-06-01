import { Injectable } from "@nestjs/common";
import { boardM, BoardSqls } from "@/models/Board";
import { groupM } from "@/models/Group";
import { listBoard } from "./fncs/list_board";
import { type QueryBuilder } from "@/global/db";
import { createSignedUrl, addDevOnKey } from "@/utils/s3";
import * as mime from "mime-types";
import { env } from "@/env";
import { updateAggr, type BoardAggrOptionT } from "./fncs/update_aggr";
import * as err from "@/errors";
import type { BoardT, BoardFormT, GetBoardOptionT, ListBoardOptionT } from "@/types/Board";


@Injectable()
export class BoardService {
  async create(form: BoardFormT): Promise<BoardT> {
    const created = await boardM.create(form);
    if (!created) {
      throw new err.NotAppliedE();
    }
    return created;
  }

  private builder(qb: QueryBuilder, select: any[], opt: GetBoardOptionT ) {
    const sqls = new BoardSqls(boardM.table);
    if (opt.$user_defaults && opt.userId) {
      select.push(...sqls.userDefaults(opt.userId));
    }
    if (opt.$posts) {
      select.push(sqls.posts());
    }
  }

  async updateAggrs(id: idT, opt: BoardAggrOptionT): Promise<BoardT|null> {
    return await updateAggr(id, opt);
  }

  async updateAggrAll(): Promise<void> {
    const boards = await boardM.find();
    for (const board of boards) {
      await updateAggr(board.id, {
        num_follower: true,
        num_post: true,
        hot_score: true,
      });
    }
  }

  async get(id: idT, opt: GetBoardOptionT = {}): Promise<BoardT> {

    const fetched = await boardM.findById(id, {
      builder: (qb, select) => {
        this.builder(qb, select, opt);
      }
    });
    if (!fetched) {
      throw new err.NotExistE();
    }
    return fetched;
  }

  async getWithGroupCheck(id: idT, groupKey: string, opt: GetBoardOptionT = {}): Promise<BoardT> {
    const group = await groupM.findOne({ key: groupKey });
    if (!group) {
      throw new err.WrongGroupE("group not found");
    }
    const fetched = await this.get(id, opt);
    if (fetched.group_id !== group.id) {
      throw new err.WrongGroupE();
    }
    return fetched;
  }


  async getByNameAndGroup(name: string, groupId: idT, opt: GetBoardOptionT = {}): Promise<BoardT> {
    const fetched = await boardM.findOne({ name, group_id: groupId }, {
      builder: (qb, select) => {
        this.builder(qb, select, opt);
      }
    });
    if (!fetched) {
      throw new err.NotExistE();
    }
    return fetched;
  }


  async update(id: idT, form: Partial<BoardFormT>) {
    const updated = await boardM.updateOne({ id }, form);
    if (!updated) {
      throw new err.NotAppliedE();
    }
    return updated;
  }


  async list(opt: ListBoardOptionT = {}): Promise<ListData<BoardT>> {
    return listBoard(opt);
  }

  async getAvatarPresignedUrl(boardId: idT, mimeType: string) {
    let key = `boards/${boardId}/avatar_${new Date().getTime()}.${mime.extension(mimeType)}`;
    if (env.STAGE == "dev") {
      key = `dev/${key}`;
    }
    const putUrl = await createSignedUrl(key, mimeType);
    return { putUrl, key };
  }

  async getBgCoverPresignedUrl(boardId: idT, mimeType: string) {
    let key = `boards/${boardId}/bg-cover_${new Date().getTime()}.${mime.extension(mimeType)}`;
    key = addDevOnKey(key);
    const putUrl = await createSignedUrl(key, mimeType);
    return { putUrl, key };
  }

  async getDefaultAvatarPresignedUrl(boardId: idT, mimeType: string) {
    let key = `boards/${boardId}/default-avatar_${new Date().getTime()}.${mime.extension(mimeType)}`;
    key = addDevOnKey(key);
    const putUrl = await createSignedUrl(key, mimeType);
    return { putUrl, key };
  }
}