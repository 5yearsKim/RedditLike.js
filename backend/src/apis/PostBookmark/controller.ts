import {
  Controller, Post, Delete,
  Body, Param, Query,
  UseGuards, ParseIntPipe,
} from "@nestjs/common";
import { PostBookmarkService } from "./service";
import * as err from "@/errors";
import { UserGuard } from "@/apis/$guards";
import { User } from "@/apis/$decorators";
import {
  CreatePostBookmarkDto,
} from "./dtos";
import type * as R from "@/types/PostBookmark.api";
import type { UserT } from "@/types";


@Controller("post-bookmarks")
export class PostBookmarkController {
  constructor(private readonly service: PostBookmarkService) {}

  @UseGuards(UserGuard)
  @Post("/")
  async create(@User() user: UserT, @Body() body: CreatePostBookmarkDto): Promise<R.CreateRsp> {
    const { form } = body satisfies R.CreateRqs;
    if (form.user_id !== user.id) {
      throw new err.ForbiddenE("Invalid user");
    }
    const created = await this.service.create(form);
    return created;
  }

  @UseGuards(UserGuard)
  @Delete("/:id")
  async delete(
    @User() user: UserT,
    @Param("id", ParseIntPipe) id: idT,
  ): Promise<R.CreateRsp> {

    const bookmark = await this.service.get(id);

    if (bookmark.user_id !== user.id) {
      throw new err.ForbiddenE("Invalid user");
    }
    const deleted = await this.service.delete(id);
    return deleted;
  }
}