import type { XUserCategoryT } from "./XUserCategory";


// (POST) /
export type CreateRqs = {categoryId: idT}
export type CreateRsp = XUserCategoryT

// (DELETE) /
export type DeleteRqs = {categoryId: idT}
export type DeleteRsp = XUserCategoryT