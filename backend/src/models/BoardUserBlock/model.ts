import { DataModel } from "@/utils/orm";
import type { BoardUserBlockFormT, BoardUserBlockT } from "@/types/BoardUserBlock";


const table = "board_user_blocks";
export const boardUserBlockM = new DataModel<BoardUserBlockFormT, BoardUserBlockT>(table);