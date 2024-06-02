import { Injectable } from "@nestjs/common";
import * as err from "@/errors";
import { adminM } from "@/models/Admin";
import { userM } from "@/models/User";
import { listAdmin } from "./fncs/list_admin";
import type { AdminT, AdminFormT, GetAdminOptionT, ListAdminOptionT } from "@/types";

@Injectable()
export class AdminService {
  constructor() {}

  async get(id: idT, getOpt: GetAdminOptionT = {}): Promise<AdminT> {
    const fetched = await adminM.findOne({ id });
    if (!fetched) {
      throw new err.NotExistE();
    }
    return fetched;
  }

  async getMe(userId: idT ): Promise<AdminT|null> {
    const fetched = await adminM.findOne({ user_id: userId });
    return fetched;
  }

  async create(form: AdminFormT): Promise<AdminT> {
    const created = await adminM.create(form);
    if (!created) {
      throw new err.NotAppliedE();
    }
    return created;
  }

  async list(listOpt: ListAdminOptionT): Promise<ListData<AdminT>> {
    return await listAdmin(listOpt);
  }

  async update(id: idT, form: Partial<AdminFormT>): Promise<AdminT> {
    const updated = await adminM.updateOne({ id }, form);
    if (!updated) {
      throw new err.NotAppliedE();
    }
    return updated;
  }

  async delete(id: idT): Promise<AdminT> {
    const deleted = await adminM.deleteOne({ id });
    if (!deleted) {
      throw new err.NotAppliedE();
    }
    return deleted;
  }

  async createByEmail(email: string): Promise<AdminT> {
    const users = await userM.find({
      builder: (qb) => {
        qb.where("email", email)
          .andWhere("deleted_at", null);
      }
    });
    if (users.length === 0) {
      throw new err.NotExistE("user with email not found");
    }
    const user = users[0];

    const fetched = await adminM.findOne({ user_id: user.id });

    if (fetched) {
      throw new err.AlreadyExistE("admin already");
    }

    const form: AdminFormT = {
      user_id: user.id,
    };
    const created = await adminM.create(form);
    if (!created) {
      throw new err.NotAppliedE();
    }
    return created;
  }
}