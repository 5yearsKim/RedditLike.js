import {
  Controller, Post,
  Body, Ip,
} from "@nestjs/common";
import { User } from "@/apis/$decorators";
import { PostCheckService } from "./service";
import { CheckDto } from "./dtos";
import { UserT } from "@/types";
import type * as R from "@/types/PostCheck.api";
import * as err from "@/errors";


@Controller("post-checks")
export class PostCheckController {
  constructor(private readonly service: PostCheckService) {}

  @Post("/check")
  async check(@User() user: UserT|null, @Ip() ip: string, @Body() body: CheckDto): Promise<R.CheckRsp> {
    const { postId, type } = body satisfies R.CheckRqs;
    if (type === "user" && user !== null) {
      return await this.service.checkByUser(user.id, ip, postId);
    } else if (type === "ip") {
      return await this.service.checkByIp(ip, postId);
    } else {
      throw new err.InvalidDataE("Unknown post check type");
    }
  }
}