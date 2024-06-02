import { Injectable } from "@nestjs/common";
import { userM } from "@/models/User";
import * as err from "@/errors";
import { addDays } from "date-fns";
import { env } from "@/env";
import * as jwt from "jsonwebtoken";
import { listUser } from "./fncs/list_user";
import type { UserFormT, UserT, UserSessionT, GetUserOptionT, ListUserOptionT } from "@/types";


@Injectable()
export class UserService {
  private generateUserSession(user: UserT): UserSessionT {
    const expiresAt = addDays(new Date(), 90);
    const payload = {
      iat: new Date().getTime(),
      exp: expiresAt.getTime() / 1000,
      iss: "onioncontents",
      user,
    };
    const token = jwt.sign(payload, env.USER_SECRET);
    const session: UserSessionT = {
      user,
      token,
      tokenExpAt: expiresAt.getTime() / 1000,
    };
    return session;
  }

  async create(form: UserFormT): Promise<UserT> {
    const created = await userM.create(form);
    if (!created) {
      throw new err.NotAppliedE();
    }
    return created;
  }

  async get(id: idT, getOpt: GetUserOptionT = {}): Promise<UserT> {
    const fetched = await userM.findOne({ id, deleted_at: null });
    if (!fetched) {
      throw new err.NotExistE();
    }
    return fetched;
  }

  async update(id: idT, form: Partial<UserFormT>): Promise<UserT> {
    const updated = await userM.updateOne({ id }, form);
    if (!updated) {
      throw new err.NotAppliedE();
    }
    return updated;
  }

  async list(listOpt: ListUserOptionT): Promise<ListData<UserT>> {
    return await listUser(listOpt);
  }

  // async access(accountId: idT, groupId: idT): Promise<UserSessionT|null> {
  //   const group = await groupM.findById(groupId);
  //   if (!group) {
  //     throw new err.NotExistE("group not exist");
  //   }
  //   const fetched = await userM.findOne({
  //     account_id: accountId,
  //     group_id: groupId,
  //     deleted_at: null,
  //   });

  //   if (!fetched) {
  //     return null;
  //   }
  //   return this.generateUserSession(fetched);
  // }


  async deleteMe(idT: idT): Promise<UserT> {
    const deleted = await userM.deleteOne({ id: idT });
    if (!deleted) {
      throw new err.NotAppliedE();
    }
    return deleted;
  }
}


