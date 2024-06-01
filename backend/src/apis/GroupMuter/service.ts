import { Injectable } from "@nestjs/common";
import { groupMuterM } from "@/models/GroupMuter";
import { listGroupMuter } from "./fncs/list_group_muter";
import * as err from "@/errors";
import type {
  GroupMuterT, GroupMuterFormT, GetGroupMuterOptionT, ListGroupMuterOptionT,
} from "@/types";


@Injectable()
export class GroupMuterService {
  constructor() {}

  async get(id: idT, getOpt: GetGroupMuterOptionT = {}): Promise<GroupMuterT> {
    const fetched = await groupMuterM.findById(id);
    if (!fetched) {
      throw new err.NotExistE();
    }
    return fetched;
  }

  async getMe(userId: idT, groupId: idT): Promise<GroupMuterT|null> {
    const fetched = await groupMuterM.findOne({ user_id: userId, group_id: groupId });
    return fetched;
  }

  async create(form: GroupMuterFormT): Promise<GroupMuterT> {
    const created = await groupMuterM.upsert(form, { onConflict: ["group_id", "user_id"] });
    if (!created) {
      throw new err.NotAppliedE();
    }
    return created;
  }

  async list(listOpt: ListGroupMuterOptionT): Promise<ListData<GroupMuterT>> {
    return await listGroupMuter(listOpt);
  }

  async delete(id: idT): Promise<GroupMuterT> {
    const deleted = await groupMuterM.deleteOne({ id });
    if (!deleted) {
      throw new err.NotAppliedE();
    }
    return deleted;
  }

}