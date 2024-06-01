import { Injectable } from "@nestjs/common";
// import * as err from "@/errors";
import { xBoardUserFlairM } from "@/models/XBoardUserFlair";
import { XBoardUserFlairT, XBoardUserFlairFormT } from "@/types";


@Injectable()
export class XBoardUserFlairService {
  constructor() {}

  async linkMe(boardUserId: idT, flairIds: idT[]): Promise<XBoardUserFlairT[]> {
    await xBoardUserFlairM.deleteMany({ board_user_id: boardUserId });

    if (flairIds.length === 0) {
      return [];
    }
    const forms = flairIds.map<XBoardUserFlairFormT>((flairId, idx) => ({
      board_user_id: boardUserId,
      flair_id: flairId,
      rank: idx,
    }));
    const created = await xBoardUserFlairM.createMany(forms);
    return created;
  }
}