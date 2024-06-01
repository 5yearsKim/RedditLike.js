import { server } from "@/system/server";
import * as R from "@/types/PollCand.api";
import type { ListPollCandOptionT } from "@/types";

const root = "/poll-cands";


export async function list(listOpt: ListPollCandOptionT): Promise<R.ListRsp> {
  const params: R.ListRqs = listOpt;
  const rsp = await server.get(`${root}`, { params });
  return rsp.data;
}

export async function getThumbnailPresignedUrl(mimeType:string): Promise<R.ThumbnailPresignedUrlRsp> {
  const body: R.ThumbnailPresignedUrlRqs = { mimeType };
  const rsp = await server.post(`${root}/thumbnail/presigned-url`, body);
  return rsp.data;
}
