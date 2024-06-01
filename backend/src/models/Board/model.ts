import { DataModel } from "@/utils/orm";
import type { BoardFormT, BoardT } from "@/types/Board";

const table = "boards";

export const boardM = new DataModel<BoardFormT, BoardT>(table);

