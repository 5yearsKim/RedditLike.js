import { DataModel } from "@/utils/orm";
import type { UserFormT, UserT } from "@/types/User";


const table = "users";
export const userM = new DataModel<UserFormT, UserT>(table);

