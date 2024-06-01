import { Injectable } from "@nestjs/common";
import type { BoardFollowerFormT, BoardFollowerT } from "@/models/BoardFollower";
import { boardFollowerM } from "@/models/BoardFollower";
import * as err from "@/errors";

@Injectable()
export class BoardFollowerService {
  constructor() {}

  async get(id: idT): Promise<BoardFollowerT> {
    const boardFollower = await boardFollowerM.findById(id);
    if (!boardFollower) {
      throw new err.NotExistE();
    }
    return boardFollower;
  }

  async create(form: BoardFollowerFormT): Promise<BoardFollowerT> {
    const created = await boardFollowerM.upsert(form, { onConflict: ["user_id", "board_id"] });
    if (!created) {
      throw new err.NotAppliedE();
    }
    return created;
  }

  async unfollow(userId: idT, boardId: idT): Promise<BoardFollowerT> {
    const deleted = await boardFollowerM.deleteOne({ user_id: userId, board_id: boardId });
    if (!deleted) {
      throw new err.NotAppliedE();
    }
    return deleted;
  }


}