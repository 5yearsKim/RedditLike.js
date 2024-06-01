import { DataModel } from "@/utils/orm";
import type { GroupMuterFormT, GroupMuterT } from "@/types/GroupMuter";


const table = "group_muters";
export const groupMuterM = new DataModel<GroupMuterFormT, GroupMuterT>(table);
