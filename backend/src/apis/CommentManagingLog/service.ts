import { Injectable } from "@nestjs/common";
import * as err from "@/errors";
import { commentManagingLogM, CommentManagingLogSqls } from "@/models/CommentManagingLog";
import type { CommentManagingLogFormT, CommentManagingLogT, ListCommentManagingLogOptionT } from "@/types";

@Injectable()
export class CommentManagingLogService {
  constructor() {}

  async create(form: CommentManagingLogFormT): Promise<CommentManagingLogT> {
    const created = await commentManagingLogM.create(form);
    if (!created) {
      throw new err.NotAppliedE();
    }
    return created;
  }

  async list(listOpt: ListCommentManagingLogOptionT): Promise<ListData<CommentManagingLogT>> {
    const opt = listOpt;

    const sqls = new CommentManagingLogSqls(commentManagingLogM.table);

    const fetched = await commentManagingLogM.find({
      builder: (qb, select) => {
        qb.orderBy("created_at", "desc").limit(30);
        if (opt.commentId) {
          qb.where("comment_id", opt.commentId);
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