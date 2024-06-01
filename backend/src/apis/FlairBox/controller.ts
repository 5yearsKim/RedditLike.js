import {
  Controller, Post, Get, Patch, Delete,
  Body, Param, Query,
  UseGuards, ParseIntPipe,
} from "@nestjs/common";
import { UserGuard, checkManager } from "@/apis/$guards";
import { User } from "@/apis/$decorators";
import { FlairBoxService } from "./service";
import type * as R from "@/types/FlairBox.api";
import {
  CreateFlairBoxDto,
  GetFlairBoxDto,
  ListFlairBoxDto,
  UpdateFlairBoxDto,
} from "./dtos";
import type { UserT } from "@/types";


@Controller("flair-boxes")
export class FlairBoxController {
  constructor(private readonly service: FlairBoxService) {}

  @UseGuards(UserGuard)
  @Post("/")
  async create(
    @User() user: UserT,
    @Body() body: CreateFlairBoxDto,
  ): Promise<R.CreateRsp> {

    const { form } = body satisfies R.CreateRqs;
    await checkManager(user.id, form.board_id, { manage_exposure: true });

    const created = await this.service.create(form);
    return created;
  }

  @Get("/")
  async list(
    @User() user: UserT,
    @Query() query: ListFlairBoxDto,
  ): Promise<R.ListRsp> {
    const listOpt = query satisfies R.ListRqs;
    if (user) {
      listOpt.userId = user.id;
    }
    const listRsp = await this.service.list(listOpt);
    return listRsp;
  }

  @Get("/:id")
  async get(
    @User() user: UserT,
    @Param("id", ParseIntPipe) id: idT,
    @Query() query: GetFlairBoxDto,
  ): Promise<R.GetRsp> {
    const getOpt = query satisfies R.GetRqs;
    if (user) {
      getOpt.userId = user.id;
    }
    const fetched = await this.service.get(id, getOpt);
    return { data: fetched };
  }

  @UseGuards(UserGuard)
  @Patch("/:id")
  async update(
    @User() user: UserT,
    @Param("id", ParseIntPipe) id: idT,
    @Body() body: UpdateFlairBoxDto,
  ): Promise<R.UpdateRsp> {

    const { form } = body satisfies R.UpdateRqs;
    const flairBox = await this.service.get(id);
    await checkManager(user.id, flairBox.board_id, { manage_exposure: true });

    const updated = await this.service.update(id, form);
    return updated;
  }

  @UseGuards(UserGuard)
  @Delete("/:id")
  async delete(
    @User() user: UserT,
    @Param("id", ParseIntPipe) id: idT,
  ): Promise<R.DeleteRsp> {

    const flairBox = await this.service.get(id);
    await checkManager(user.id, flairBox.board_id, { manage_exposure: true });

    const deleted = await this.service.delete(id);
    return deleted;
  }

}