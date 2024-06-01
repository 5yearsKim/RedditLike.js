import { Injectable } from "@nestjs/common";
// import * as err from "@/errors";
import { xBoardCategoryM } from "@/models/XBoardCategory";
import { knex } from "@/global/db";
import type { XBoardCategoryT, XBoardCategoryFormT } from "@/types";


@Injectable()
export class XBoardCategoryService {
  constructor() {}

  async link(boardId: idT, categoryIds: idT[]) : Promise<XBoardCategoryT[]> {
    if (categoryIds.length === 0) {
      const deleted = await xBoardCategoryM.deleteMany({ board_id: boardId });
      return deleted;
    }
    let created: XBoardCategoryT[] = [];
    await knex.transaction(async (trx) => {
      await xBoardCategoryM.deleteMany({ board_id: boardId }, { trx });
      const forms = categoryIds.map<XBoardCategoryFormT>((cateogryId) => ({
        board_id: boardId,
        category_id: cateogryId,
      }));
      created = await xBoardCategoryM.createMany(forms, { trx });
    });
    return created;
  }
}