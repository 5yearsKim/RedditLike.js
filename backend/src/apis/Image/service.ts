import { Injectable } from "@nestjs/common";
import * as err from "@/errors";
import { imageM } from "@/models/Image";
import type { ImageFormT, ImageT } from "@/types/Image";

@Injectable()
export class ImageService {
  constructor() {}

  async create(form: ImageFormT): Promise<ImageT> {
    const created = await imageM.create(form);
    if (!created) {
      throw new err.NotAppliedE();
    }
    return created;
  }
}