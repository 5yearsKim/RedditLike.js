import { DataModel } from "@/utils/orm";
import type { BoardManagerFormT, BoardManagerT } from "@/types/BoardManager";


const table = "board_managers";
export const boardManagerM = new DataModel<BoardManagerFormT, BoardManagerT>(table);


