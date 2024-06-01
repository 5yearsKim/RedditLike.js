import { Injectable } from "@nestjs/common";
import * as err from "@/errors";
import { groupAdminM } from "@/models/GroupAdmin";
import { userM } from "@/models/User";
import { listGroupAdmin } from "./fncs/list_group_admin";
import type { GroupAdminT, GroupAdminFormT, GetGroupAdminOptionT, ListGroupAdminOptionT } from "@/types";

@Injectable()
export class GroupAdminService {
  constructor() {}

  async get(id: idT, getOpt: GetGroupAdminOptionT = {}): Promise<GroupAdminT> {
    const fetched = await groupAdminM.findOne({ id });
    if (!fetched) {
      throw new err.NotExistE();
    }
    return fetched;
  }

  async getMe(userId: idT, groupId: idT): Promise<GroupAdminT|null> {
    const fetched = await groupAdminM.findOne({ user_id: userId, group_id: groupId });
    return fetched;
  }

  async create(form: GroupAdminFormT): Promise<GroupAdminT> {
    const created = await groupAdminM.create(form);
    if (!created) {
      throw new err.NotAppliedE();
    }
    return created;
  }

  async list(listOpt: ListGroupAdminOptionT): Promise<ListData<GroupAdminT>> {
    return await listGroupAdmin(listOpt);
  }

  async update(id: idT, form: Partial<GroupAdminFormT>): Promise<GroupAdminT> {
    const updated = await groupAdminM.updateOne({ id }, form);
    if (!updated) {
      throw new err.NotAppliedE();
    }
    return updated;
  }

  async delete(id: idT): Promise<GroupAdminT> {
    const deleted = await groupAdminM.deleteOne({ id });
    if (!deleted) {
      throw new err.NotAppliedE();
    }
    return deleted;
  }

  async createByEmail(email: string, groupId: idT): Promise<GroupAdminT> {
    const users = await userM.find({
      builder: (qb) => {
        qb.leftJoin("accounts", "accounts.id", "=", `${userM.table}.account_id`);
        qb.where("accounts.email", email);
        qb.where(`${userM.table}.group_id`, groupId);
        qb.where(`${userM.table}.deleted_at`, null);

      }
    });
    if (users.length === 0) {
      throw new err.NotExistE("user with email not found");
    }
    const user = users[0];

    const fetched = await groupAdminM.findOne({ user_id: user.id, group_id: groupId });

    if (fetched) {
      throw new err.AlreadyExistE("admin already");
    }

    const form: GroupAdminFormT = {
      user_id: user.id,
      group_id: groupId,
    };
    const created = await groupAdminM.create(form);
    if (!created) {
      throw new err.NotAppliedE();
    }
    return created;
  }
}