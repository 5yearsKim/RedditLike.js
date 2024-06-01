import { DataModel, SqlInjector } from "@/utils/orm";
import type { CommentVoteFormT, CommentVoteT } from "./schema";


const table = "comment_votes";
export const commentVoteM = new DataModel<CommentVoteFormT, CommentVoteT>(table);


export class CommentVoteSqls extends SqlInjector {
  constructor() {
    super(table);
  }
}
