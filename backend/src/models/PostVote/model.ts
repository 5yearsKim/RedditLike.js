import { DataModel, SqlInjector } from "@/utils/orm";
import type { PostVoteFormT, PostVoteT } from "./schema";


const table = "post_votes";
export const postVoteM = new DataModel<PostVoteFormT, PostVoteT>(table);


export class PostVoteSqls extends SqlInjector {
  constructor() {
    super(table);
  }
}
