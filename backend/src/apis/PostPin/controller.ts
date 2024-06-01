import {
  Controller, Post, Delete,
  Body, Param, Query, UseGuards,
} from "@nestjs/common";
import { PostPinService } from "./service";
import type * as R from "@/types/PostPin.api";
import * as err from "@/errors";
import { UserGuard, checkManager } from "@/apis/$guards";
import { User } from "@/apis/$decorators";
import type { UserT } from "@/types";
import {
  CreatePostPinDto,
  DeletePostPinDto,
} from "./dtos";


@Controller("post-pins")
export class PostPinController {
  constructor(private readonly service: PostPinService) {}

  @UseGuards(UserGuard)
  @Post("/")
  async create(@User() user: UserT, @Body() body: CreatePostPinDto): Promise<R.CreateRsp> {
    const { form } = body satisfies R.CreateRqs;
    await checkManager(user.id, form.board_id);
    const created = await this.service.create(form);
    return created;
  }

  @UseGuards(UserGuard)
  @Delete("/")
  async delete(@User() user: UserT, @Body() body: DeletePostPinDto): Promise<R.DeleteRsp> {
    const { boardId, postId } = body;
    await checkManager(user.id, boardId);
    const deleted = await this.service.delete(boardId, postId);
    return deleted;
  }
}