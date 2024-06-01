import { Injectable } from "@nestjs/common";
import * as err from "@/errors";
import { postPinM } from "@/models/PostPin";
import type { PostPinFormT, PostPinT } from "@/types";

@Injectable()
export class PostPinService {
  constructor() {}

  async create(form: PostPinFormT ): Promise<PostPinT>{
    const created = await postPinM.create(form);
    if (!created) {
      throw new err.NotAppliedE();
    }
    return created;
  }

  async delete(boardId: idT, postId: idT): Promise<PostPinT> {
    const deleted = await postPinM.deleteOne({ board_id: boardId, post_id: postId });
    if (!deleted) {
      throw new err.NotAppliedE();
    }
    return deleted;
  }
}