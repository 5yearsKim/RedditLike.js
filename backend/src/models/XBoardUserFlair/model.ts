import { DataModel } from "@/utils/orm";
import type { XBoardUserFlairFormT, XBoardUserFlairT } from "@/types/XBoardUserFlair";


const table = "x_board_user_flair";
export const xBoardUserFlairM = new DataModel<XBoardUserFlairFormT, XBoardUserFlairT>(table);


