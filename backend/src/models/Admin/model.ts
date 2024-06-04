import { DataModel } from "@/utils/orm";
import type { AdminFormT, AdminT } from "@/types/Admin";


const table = "admins";
export const adminM = new DataModel<AdminFormT, AdminT>(table);
