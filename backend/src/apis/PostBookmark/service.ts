import { Injectable } from "@nestjs/common";
import * as err from "@/errors";
import { postBookmarkM } from "@/models/PostBookmark";
import type { PostBookmarkFormT, PostBookmarkT } from "@/types";

@Injectable()
export class PostBookmarkService {
  constructor() {}

  async get(id: idT) : Promise<PostBookmarkT> {
    const fetched = await postBookmarkM.findById(id);
    if (!fetched) {
      throw new err.NotExistE();
    }
    return fetched;
  }

  async create(form: PostBookmarkFormT): Promise<PostBookmarkT> {
    const created = await postBookmarkM.create(form);
    if (!created) {
      throw new err.NotAppliedE();
    }
    return created;
  }

  async delete(id: idT): Promise<PostBookmarkT> {
    const deleted = await postBookmarkM.deleteOne({ id });
    if (!deleted) {
      throw new err.NotAppliedE();
    }
    return deleted;
  }
}