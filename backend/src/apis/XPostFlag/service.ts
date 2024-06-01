import { Injectable } from "@nestjs/common";
import { xPostFlagM } from "@/models/XPostFlag";
import type { XPostFlagFormT, XPostFlagT } from "@/models/XPostFlag";
import * as err from "@/errors";

@Injectable()
export class XPostFlagService {
  constructor() {}

  async create(form: XPostFlagFormT ): Promise<XPostFlagT> {
    const created = await xPostFlagM.create(form);
    if (!created) {
      throw new err.NotAppliedE();
    }
    return created;
  }
}