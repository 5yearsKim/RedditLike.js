import { DataModel } from "@/utils/orm";
import type { XUserCategoryFormT, XUserCategoryT } from "@/types";


const table = "x_user_category";
export const xUserCategoryM = new DataModel<XUserCategoryFormT, XUserCategoryT>(table);


