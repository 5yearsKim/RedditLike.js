import {
  Controller, Post, Get, Delete,
  Body, Param, Query,
  UseGuards, ParseIntPipe,
} from "@nestjs/common";
import { User } from "@/apis/$decorators";
import { UserGuard } from "@/apis/$guards";
import {
  CreateBoardUserBlockDto,
  ListBoardUserBlockDto,
} from "./dtos";
import { BoardUserBlockService } from "./service";
import * as err from "@/errors";
import type * as R from "@/types/BoardUserBlock.api";
import type { UserT } from "@/types";


@Controller("board-user-blocks")
export class BoardUserBlockController {
  constructor(private readonly service: BoardUserBlockService) {}

  @UseGuards(UserGuard)
  @Post("/")
  async create(
    @User() user: UserT,
    @Body() body: CreateBoardUserBlockDto,
  ): Promise<R.CreateRsp> {
    const { form } = body satisfies R.CreateRqs;

    if (form.from_id !== user.id) {
      throw new err.ForbiddenE("from_id not matching");
    }
    const created = this.service.create(form);
    return created;
  }

  @UseGuards(UserGuard)
  @Get("/")
  async list(
    @User() user: UserT,
    @Query() query: ListBoardUserBlockDto,
  ): Promise<R.ListRsp> {

    const listOpt = query satisfies R.ListRqs;
    listOpt.userId = user.id;
    const { data, nextCursor } = await this.service.list(listOpt);
    return { data, nextCursor };
  }

  @UseGuards(UserGuard)
  @Delete("/:id")
  async delete(
    @User() user: UserT,
    @Param("id", ParseIntPipe) id: idT,
  ): Promise<R.DeleteRsp> {

    const block = await this.service.get(id);
    if (block.from_id !== user.id) {
      throw new err.ForbiddenE("from_id not matching");
    }

    const deleted = await this.service.delete(id);
    return deleted;
  }

}