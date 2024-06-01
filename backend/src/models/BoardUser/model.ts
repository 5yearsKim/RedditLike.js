import { DataModel } from "@/utils/orm";
import type { BoardUserFormT, BoardUserT } from "@/types/BoardUser";


const table = "board_users";
export const boardUserM = new DataModel<BoardUserFormT, BoardUserT>(table);


