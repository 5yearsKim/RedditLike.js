import { Injectable } from "@nestjs/common";
import * as err from "@/errors";
import { videoM } from "@/models/Video";
import type { VideoFormT, VideoT } from "@/types/Video";


@Injectable()
export class VideoService {
  constructor() {}

  async create(form: VideoFormT): Promise<VideoT> {
    const created = await videoM.create(form);
    if (!created) {
      throw new err.NotAppliedE();
    }
    return created;
  }
}