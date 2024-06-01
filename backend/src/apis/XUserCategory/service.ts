import { Injectable } from "@nestjs/common";
import * as err from "@/errors";
import { xUserCategoryM } from "@/models/XUserCategory";
import type { XUserCategoryT, XUserCategoryFormT } from "@/types/XUserCategory";

@Injectable()
export class XUserCategoryService {
  constructor() {}

  async create(userId: idT, categoryId: idT) : Promise<XUserCategoryT> {
    const form: XUserCategoryFormT = {
      user_id: userId,
      category_id: categoryId,
    };
    const created = await xUserCategoryM.upsert(form, { onConflict: ["user_id", "category_id"] });
    if (!created) {
      throw new err.NotAppliedE();
    }
    return created;
  }

  async delete(userId: idT, categoryId: idT): Promise<XUserCategoryT> {
    const deleted = await xUserCategoryM.deleteOne({ user_id: userId, category_id: categoryId });
    if (!deleted) {
      throw new err.NotAppliedE();
    }
    return deleted;

  }
}