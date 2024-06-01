import { DataModel, SqlInjector } from "@/utils/orm";
import type { BoardFollowerFormT, BoardFollowerT } from "./schema";


const table = "board_followers";
export const boardFollowerM = new DataModel<BoardFollowerFormT, BoardFollowerT>(table);


export class BoardFollowerSqls extends SqlInjector {
  constructor() {
    super(table);
  }
}
