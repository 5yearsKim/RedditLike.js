import { DataModel } from "@/utils/orm";
import type { BoardBlockFormT, BoardBlockT } from "@/types/BoardBlock";


const table = "board_blocks";
export const boardBlockM = new DataModel<BoardBlockFormT, BoardBlockT>(table);


