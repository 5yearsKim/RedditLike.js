import { Injectable } from "@nestjs/common";
import * as err from "@/errors";
import { boardBlockM } from "@/models/BoardBlock";
import type { BoardBlockFormT, BoardBlockT } from "@/types";


@Injectable()
export class BoardBlockService {
  constructor() {}

  async get(id: idT): Promise<BoardBlockT> {
    const boardBlock = await boardBlockM.findById( id );
    if (!boardBlock) {
      throw new err.NotExistE();
    }
    return boardBlock;
  }

  async create(form: BoardBlockFormT ): Promise<BoardBlockT>{
    const created = await boardBlockM.create(form);
    if (!created) {
      throw new err.NotAppliedE();
    }
    return created;
  }

  async delete(id: idT): Promise<BoardBlockT> {
    const deleted = await boardBlockM.deleteOne({ id });
    if (!deleted) {
      throw new err.NotAppliedE();
    }
    return deleted;
  }
}