import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, Query,
  UseGuards, ParseIntPipe,
} from "@nestjs/common";
import { User } from "@/apis/$decorators";
import { UserGuard, checkManager } from "@/apis/$guards";
import {
  CreateFlagDto,
  UpdateFlagDto,
  ListFlagDto
} from "./dtos";
import { FlagService } from "./service";
import type * as R from "@/types/Flag.api";
import type { UserT } from "@/types";


@Controller("flags")
export class FlagController {
  constructor(private readonly service: FlagService) {}

  @UseGuards(UserGuard)
  @Post("/")
  async create(
    @User() user: UserT,
    @Body() body: CreateFlagDto,
  ): Promise<R.CreateRsp> {
    const { form } = body satisfies R.CreateRqs ;
    await checkManager(user.id, form.board_id, { manage_contents: true });

    const created = await this.service.create(form);
    return created;
  }

  @Get("/")
  async list(
    @Query() query: ListFlagDto,
  ): Promise<R.ListRsp> {
    const listOpt = query satisfies R.ListRqs;
    const { data, nextCursor } = await this.service.list(listOpt);
    return { data, nextCursor };
  }

  @UseGuards(UserGuard)
  @Delete("/:id")
  async delete(
    @User() user: UserT,
    @Param("id", ParseIntPipe) id: number,
  ): Promise<R.DeleteRsp> {

    const flag = await this.service.get(id);
    await checkManager(user.id, flag.board_id, { manage_contents: true });
    const deleted = await this.service.delete(id);
    return deleted;
  }

  @UseGuards(UserGuard)
  @Patch("/:id")
  async update(
    @User() user: UserT,
    @Param("id", ParseIntPipe) id: number,
    @Body() body: UpdateFlagDto,
  ): Promise<R.UpdateRsp> {

    const { form } = body satisfies R.UpdateRqs;
    const flag = await this.service.get(id);
    await checkManager(user.id, flag.board_id, { manage_contents: true });

    const updated = await this.service.update(id, form);
    return updated;
  }

}