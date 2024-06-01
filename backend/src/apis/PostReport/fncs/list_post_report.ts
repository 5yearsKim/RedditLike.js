import { postReportM } from "@/models/PostReport";
import { encodeCursor, decodeCursor } from "@/utils/formatter";
import * as err from "@/errors";
import { lookupBuilder } from "./lookup_builder";
import type { ListPostReportOptionT, PostReportT } from "@/types";

export async function listPostReport(opt: ListPostReportOptionT): Promise<ListData<PostReportT>> {
  let nextCursor: null|string = null;
  const limit = opt.limit || 30;
  const getNextCursor: (item: PostReportT) => string|null = (item) => encodeCursor({
    created_at: item.created_at,
  });

  const fetched = await postReportM.find({
    builder: (qb, select) => {
      qb.limit(limit);

      // postId
      if (opt.postId) {
        qb.where("post_id", opt.postId);
      }
      // cursor
      if (opt.cursor) {
        const cursor = decodeCursor(opt.cursor);
        qb.where("created_at", "<", cursor.created_at);
      }
      // status
      if (opt.status) {
        switch (opt.status) {
        case "all":
          break;
        case "resolved":
          qb.whereNull("ignored_at").whereNotNull("resolved_at");
          break;
        case "ignored":
          qb.whereNull("resolved_at").whereNotNull("ignored_at");
          break;
        case "unprocessed":
          qb.whereNull("resolved_at").whereNull("ignored_at");
          break;
        default:
          throw new err.InvalidFieldE("invalid status with:" + opt.status);
        }
      }
      lookupBuilder(select, opt);
    }
  });
  if (fetched.length >= limit) {
    const lastItem = fetched[fetched.length - 1];
    nextCursor = getNextCursor(lastItem);
  }
  return {
    data: fetched,
    nextCursor,
  };
}