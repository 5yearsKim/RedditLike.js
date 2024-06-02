import {
  Controller, Post, Get, Delete,
  Body, Param, Query,
  UseGuards,
} from "@nestjs/common";
import { User } from "@/apis/$decorators";
import { UserGuard, checkAdmin } from "@/apis/$guards";
import { MuterService } from "./service";
import {
  CreateGroupMuterDto,
  ListGroupMuterDto,
} from "./dtos";
import * as err from "@/errors";
import type * as R from "@/types/Muter.api";
import type { UserT } from "@/types";


@Controller("muters")
export class MuterController {
  constructor(private readonly service: MuterService) {}

  @UseGuards(UserGuard)
  @Post("/")
  async create(
    @User() user: UserT,
    @Body() body: CreateGroupMuterDto,
  ): Promise<R.CreateRsp> {
    const { form } = body satisfies R.CreateRqs;

    await checkAdmin(user.id, { manage_muter: true });
    const created = this.service.create(form);
    return created;
  }

  @UseGuards(UserGuard)
  @Get("/")
  async list(
    @User() user: UserT,
    @Query() query: ListGroupMuterDto,
  ): Promise<R.ListRsp> {

    const listOpt = query satisfies R.ListRqs;
    await checkAdmin(user.id, { manage_muter: true });
    const { data, nextCursor } = await this.service.list(listOpt);
    return { data, nextCursor };
  }

  @UseGuards(UserGuard)
  @Get("/me")
  async getMe(
    @User() user: UserT,
  ): Promise<R.GetMeRsp> {
    const fetched = await this.service.getMe(user.id );
    return { data: fetched };
  }


  @UseGuards(UserGuard)
  @Delete("/:id")
  async delete(
    @User() user: UserT,
    @Param("id") id: idT,
  ): Promise<R.DeleteRsp> {

    await checkAdmin(user.id, { manage_muter: true });
    const deleted = await this.service.delete(id);
    return deleted;
  }


}