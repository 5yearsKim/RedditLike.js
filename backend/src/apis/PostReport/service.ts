import { Injectable } from "@nestjs/common";
import { postReportM } from "@/models/PostReport";
import * as err from "@/errors";
import { listPostReport } from "./fncs/list_post_report";
import { lookupBuilder } from "./fncs/lookup_builder";
import { PostReportFormT, PostReportT, GetPostReportOptionT, ListPostReportOptionT } from "@/types";

@Injectable()
export class PostReportService {
  constructor() {}

  async get(id: idT, getOpt: GetPostReportOptionT = {} ): Promise<PostReportT> {
    const postReport = await postReportM.findById(id, {
      builder: (qb, select) => {
        lookupBuilder(select, getOpt);
      }
    } );
    if (!postReport) {
      throw new err.NotExistE();
    }
    return postReport;
  }

  async upsert(form: PostReportFormT): Promise<PostReportT> {
    const created = await postReportM.upsert(form, { onConflict: ["post_id", "user_id"] });
    if (!created) {
      throw new err.NotAppliedE();
    }
    return created;
  }

  async list(listOpt: ListPostReportOptionT ): Promise<ListData<PostReportT>> {
    return await listPostReport(listOpt);
  }

  async update(id: idT, data: Partial<PostReportFormT>): Promise<PostReportT> {
    const updated = await postReportM.updateOne({ id }, data);
    if (!updated) {
      throw new err.NotAppliedE();
    }
    return updated;
  }

}