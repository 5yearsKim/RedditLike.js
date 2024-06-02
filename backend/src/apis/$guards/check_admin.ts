import { adminM } from "@/models/Admin";
import type { AdminT } from "@/types";
import * as err from "@/errors";


export async function checkAdmin(userId: number, roles: Partial<AdminT> = {}): Promise<AdminT> {
  const admin = await adminM.findOne({ user_id: userId });
  if (!admin) {
    throw new err.ForbiddenE("user need to be admin");
  }
  for (const key of Object.keys(roles)) {
    if (admin[key as keyof AdminT] !== roles[key as keyof AdminT]) {
      throw new err.ForbiddenE(`key ${key} need to be ${roles[key as keyof AdminT]}`);
    }
  }
  return admin;
}