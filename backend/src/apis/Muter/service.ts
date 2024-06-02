import { Injectable } from "@nestjs/common";
import { muterM } from "@/models/Muter";
import { listMuter } from "./fncs/list_muter";
import * as err from "@/errors";
import type {
  MuterT, MuterFormT, GetMuterOptionT, ListMuterOptionT,
} from "@/types";


@Injectable()
export class MuterService {
  constructor() {}

  async get(id: idT, getOpt: GetMuterOptionT = {}): Promise<MuterT> {
    const fetched = await muterM.findById(id);
    if (!fetched) {
      throw new err.NotExistE();
    }
    return fetched;
  }

  async getMe(userId: idT ): Promise<MuterT|null> {
    const fetched = await muterM.findOne({ user_id: userId });
    return fetched;
  }

  async create(form: MuterFormT): Promise<MuterT> {
    const created = await muterM.upsert(form, { onConflict: ["user_id"] });
    if (!created) {
      throw new err.NotAppliedE();
    }
    return created;
  }

  async list(listOpt: ListMuterOptionT): Promise<ListData<MuterT>> {
    return await listMuter(listOpt);
  }

  async delete(id: idT): Promise<MuterT> {
    const deleted = await muterM.deleteOne({ id });
    if (!deleted) {
      throw new err.NotAppliedE();
    }
    return deleted;
  }

}