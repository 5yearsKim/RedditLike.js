import { Injectable } from "@nestjs/common";
import * as err from "@/errors";
import { postCheckM } from "@/models/PostCheck";
import type { PostCheckFormT, PostCheckT } from "@/types/PostCheck";


@Injectable()
export class PostCheckService {
  constructor() {}

  async checkByUser(userId: idT, ip: string, postId: idT): Promise<PostCheckT> {
    const form: PostCheckFormT = {
      post_id: postId,
      user_id: userId,
    };
    const created = await postCheckM.upsert(form, {
      onConflict: ["user_id", "post_id"]
    });
    if (!created) {
      throw new err.NotAppliedE();
    }
    return created;
  }

  async checkByIp(ip: string, postId: idT) {
    const form: PostCheckFormT = {
      post_id: postId,
      ip_addr: ip,
    };

    const created = await postCheckM.upsert(form, {
      onConflict: ["ip_addr", "post_id"]
    });
    if (!created) {
      throw new err.NotAppliedE();
    }
    return created;
  }
}