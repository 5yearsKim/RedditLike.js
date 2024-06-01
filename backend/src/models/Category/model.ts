import { DataModel } from "@/utils/orm";
import type { CategoryFormT, CategoryT } from "@/types/Category";


const table = "categories";
export const categoryM = new DataModel<CategoryFormT, CategoryT>(table);
