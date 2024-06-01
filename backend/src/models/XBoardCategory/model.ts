import { DataModel } from "@/utils/orm";
import type { XBoardCategoryFormT, XBoardCategoryT } from "@/types/XBoardCategory";


const table = "x_board_category";
export const xBoardCategoryM = new DataModel<XBoardCategoryFormT, XBoardCategoryT>(table);


