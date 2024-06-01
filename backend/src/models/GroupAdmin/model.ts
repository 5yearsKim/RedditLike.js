import { DataModel } from "@/utils/orm";
import type { GroupAdminFormT, GroupAdminT } from "@/types/GroupAdmin";


const table = "group_admins";
export const groupAdminM = new DataModel<GroupAdminFormT, GroupAdminT>(table);
