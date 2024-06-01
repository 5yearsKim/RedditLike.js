import { groupAdminM } from "@/models/GroupAdmin";
import type { GroupAdminT } from "@/types";
import * as err from "@/errors";


export async function checkAdmin(userId: number, groupId: number, roles: Partial<GroupAdminT> = {}): Promise<GroupAdminT> {
  const admin = await groupAdminM.findOne({ user_id: userId, group_id: groupId });
  if (!admin) {
    throw new err.ForbiddenE("user need to be admin");
  }
  for (const key of Object.keys(roles)) {
    if (admin[key as keyof GroupAdminT] !== roles[key as keyof GroupAdminT]) {
      throw new err.ForbiddenE(`key ${key} need to be ${roles[key as keyof GroupAdminT]}`);
    }
  }
  return admin;
}