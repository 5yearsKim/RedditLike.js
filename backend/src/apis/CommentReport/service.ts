import { Injectable } from "@nestjs/common";
import { commentReportM } from "@/models/CommentReport";
import * as err from "@/errors";
import { lookupBuilder } from "./fncs/lookup_builder";
import { listCommentReport } from "./fncs/list_comment_report";
import type {
  CommentReportFormT, CommentReportT, GetCommentReportOptionT, ListCommentReportOptionT,
} from "@/types";


@Injectable()
export class CommentReportService {
  constructor() {}


  async upsert(form: CommentReportFormT): Promise<CommentReportT> {
    const created = await commentReportM.upsert(form, { onConflict: ["comment_id", "user_id"] });
    if (!created) {
      throw new err.NotAppliedE();
    }
    return created;
  }


  async get(id: idT, getOpt: GetCommentReportOptionT = {} ): Promise<CommentReportT> {
    const commentReport = await commentReportM.findById(id, {
      builder: (qb, select) => {
        lookupBuilder(select, getOpt);
      }
    } );
    if (!commentReport) {
      throw new err.NotExistE();
    }
    return commentReport;
  }


  async list(listOpt: ListCommentReportOptionT ): Promise<ListData<CommentReportT>> {
    return await listCommentReport(listOpt);
  }

  async update(id: idT, data: Partial<CommentReportFormT>): Promise<CommentReportT> {
    const updated = await commentReportM.updateOne({ id }, data);
    if (!updated) {
      throw new err.NotAppliedE();
    }
    return updated;
  }

}