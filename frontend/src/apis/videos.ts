import { server } from "@/system/server";
import * as R from "@/types/Video.api";
import type { VideoFormT } from "@/types/Video";


const root = "/videos";

export function create(form: VideoFormT): Promise<R.CreateRsp> {
  const body: R.CreateRqs = { form };
  return server.post(`${root}/videos`, body );
}