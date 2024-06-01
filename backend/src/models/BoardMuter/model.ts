import { DataModel } from "@/utils/orm";
import type { BoardMuterFormT, BoardMuterT } from "@/types/BoardMuter";


const table = "board_muters";
export const boardMuterM = new DataModel<BoardMuterFormT, BoardMuterT>(table);


