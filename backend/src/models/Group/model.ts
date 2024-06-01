import { DataModel } from "@/utils/orm";
import type { GroupFormT, GroupT } from "@/types/Group";


const table = "groups";
export const groupM = new DataModel<GroupFormT, GroupT>(table);


