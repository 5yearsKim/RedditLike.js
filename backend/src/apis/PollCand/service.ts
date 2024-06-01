import { Injectable } from "@nestjs/common";
import * as mime from "mime-types";
import { createSignedUrl, addDevOnKey } from "@/utils/s3";
import { genUniqueId } from "@/utils/random";
import { pollCandM } from "@/models/PollCand";
import * as err from "@/errors";
import { lookupBuilder } from "./fncs/lookup_builder";
import type { PollCandT, ListPollCandOptionT } from "@/types";

@Injectable()
export class PollCandService {
  constructor() {}

  async list(listOpt: ListPollCandOptionT): Promise<ListData<PollCandT>> {
    const opt = listOpt;
    if (!opt.pollId) {
      throw new err.InvalidDataE("pollId is required");
    }

    const fetched = await pollCandM.find({
      builder: (qb, select) => {
        qb.where({ poll_id: opt.pollId });
        qb.orderBy("rank", "asc");
        lookupBuilder(select, opt);
      }
    });
    return { data: fetched, nextCursor: null };
  }

  async getThumbPresignedUrl(mimeType: string) {
    let key = `poll_cands/thumbnail_${new Date().getTime()}_${genUniqueId({ len: 4 })}.${mime.extension(mimeType)}`;
    key = addDevOnKey(key);
    const putUrl = await createSignedUrl(key, mimeType);
    return { putUrl, key };
  }
}