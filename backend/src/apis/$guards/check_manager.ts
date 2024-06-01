import { boardManagerM } from "@/models/BoardManager";
import type { BoardManagerT } from "@/types";
import * as err from "@/errors";


export async function checkManager(userId: number, boardId: number, roles: Partial<BoardManagerT> = {}): Promise<BoardManagerT> {
  const manager = await boardManagerM.findOne({ user_id: userId, board_id: boardId });
  if (!manager) {
    throw new err.ForbiddenE("user need to be a manager");
  }
  for (const key of Object.keys(roles)) {
    if (manager[key as keyof BoardManagerT] !== roles[key as keyof BoardManagerT]) {
      throw new err.ForbiddenE(`key ${key} need to be ${roles[key as keyof BoardManagerT]}`);
    }
  }
  return manager;
}