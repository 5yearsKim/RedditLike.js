import { server } from "@/system/server";
import * as R from "@/types/Image.api";
import type { ImageFormT } from "@/types/Image";


const root = "/images";

export function create(form: ImageFormT): Promise<R.CreateRsp> {
  const body: R.CreateRqs = { form };
  return server.post(`${root}/images`, body );
}