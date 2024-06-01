import { Injectable } from "@nestjs/common";
import * as err from "@/errors";
import { postManagingLogM, PostManagingLogSqls } from "@/models/PostManagingLog";
import { PostManagingLogFormT, PostManagingLogT, ListPostManagingLogOptionT } from "@/types";

@Injectable()
export class PostManagingLogService {
  constructor() {}

  async create(form: PostManagingLogFormT): Promise<PostManagingLogT> {
    const created = await postManagingLogM.create(form);
    if (!created) {
      throw new err.NotAppliedE();
    }
    return created;
  }

  async list(listOpt: ListPostManagingLogOptionT) : Promise<ListData<PostManagingLogT>> {
    const opt = listOpt;
    const sqls = new PostManagingLogSqls(postManagingLogM.table);

    const fetched = await postManagingLogM.find({
      builder: (qb, select) => {
        qb.orderBy("created_at", "desc").limit(30);
        if (opt.postId) {
          qb.where("post_id", opt.postId);
        }
        // author
        if (opt.$author) {
          select.push(sqls.author());
        }
      }
    });
    return { data: fetched, nextCursor: null };
  }
}