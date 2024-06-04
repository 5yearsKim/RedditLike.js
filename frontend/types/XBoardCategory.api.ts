import { XBoardCategoryT } from "./XBoardCategory";

// (POST) /link
export type LinkRqs = {boardId: number, categoryIds: number[]}
export type LinkRsp = XBoardCategoryT[]