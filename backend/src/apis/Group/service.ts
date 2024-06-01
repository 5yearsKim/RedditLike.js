import { Injectable } from "@nestjs/common";
import { groupM } from "@/models/Group";
import { userM } from "@/models/User";
import { groupAdminM } from "@/models/GroupAdmin";
import { listGroup } from "./fncs/list_group";
import { createSignedUrl, addDevOnKey } from "@/utils/s3";
import { knex } from "@/global/db";
import mime from "mime-types";
import * as err from "@/errors";
import { lookupBuilder } from "./fncs/lookup_builder";
import type { GroupFormT, GroupT, GetGroupOptionT, ListGroupOptionT } from "@/types";


@Injectable()
export class GroupService {
  async create(form: GroupFormT, accountId: idT): Promise<GroupT> {
    let created: GroupT|null = null;
    await knex.transaction(async (trx) => {
      const group = await groupM.create(form, { trx });
      if (!group) {
        throw new err.NotAppliedE();
      }
      created = group;
      const user = await userM.create({ account_id: accountId, group_id: group.id }, { trx });
      if (!user) {
        throw new err.NotAppliedE();
      }
      await groupAdminM.create({ group_id: group.id, user_id: user.id, is_super: true }, { trx });
    });
    if (!created) {
      throw new err.NotAppliedE();
    }
    return created;
  }

  async get(id: idT, getOpt: GetGroupOptionT = {}): Promise<GroupT> {
    const fetched = await groupM.findById(id, {
      builder: (qb, select) => {
        lookupBuilder(select, getOpt);
      }
    });
    if (!fetched) {
      throw new err.NotExistE();
    }
    return fetched;
  }

  async getByKey(key: string, getOpt: GetGroupOptionT = {}): Promise<GroupT> {
    const fetched = await groupM.findOne({ key }, {
      builder: (qb, select) => {
        lookupBuilder(select, getOpt);
      }
    });
    if (!fetched) {
      throw new err.NotExistE();
    }
    return fetched;
  }

  async list(listOpt: ListGroupOptionT): Promise<ListData<GroupT>> {
    return await listGroup(listOpt);
  }

  async update(id: idT, form: Partial<GroupFormT>): Promise<GroupT> {
    const updated = await groupM.updateOne({ id }, form);
    if (!updated) {
      throw new err.NotAppliedE();
    }
    return updated;
  }

  async getAvatarPresignedUrl(groupId: idT, mimeType: string) {
    let key = `groups/${groupId}/avatar_${new Date().getTime()}.${mime.extension(mimeType)}`;
    key = addDevOnKey(key);
    const putUrl = await createSignedUrl(key, mimeType);
    return { putUrl, key };
  }
}

