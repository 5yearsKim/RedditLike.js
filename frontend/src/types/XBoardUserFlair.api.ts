import { XBoardUserFlairT } from "./XBoardUserFlair";

// (POST) /link-me
export type LinkMeRqs = {boardId: idT, flairIds: idT[]}
export type LinkMeRsp = XBoardUserFlairT[]

