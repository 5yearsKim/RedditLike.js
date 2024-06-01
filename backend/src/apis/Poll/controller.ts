import {
  Controller, Post, Patch, Get,
  Body, Param, Query,
  UseGuards, ParseIntPipe,
} from "@nestjs/common";
import { UserGuard } from "@/apis/$guards";
import { User } from "@/apis/$decorators";
import {
  CreatePollDto,
  UpdatePollDto,
  GetPollDto,
} from "./dtos";
import * as err from "@/errors";
import type * as R from "@/types/Poll.api";
import { PollService } from "./service";
import type { UserT } from "@/types";


@Controller("polls")
export class PollController {
  constructor(private readonly service: PollService) {}

  @UseGuards(UserGuard)
  @Post("/")
  async create(
    @Body() body: CreatePollDto,
  ): Promise<R.CreateRsp> {

    const { form, relations } = body satisfies R.CreateRqs;
    const created = await this.service.create(form, relations);
    return created;
  }

  @UseGuards(UserGuard)
  @Patch("/:id")
  async update(
    @User() user: UserT,
    @Param("id", ParseIntPipe) id: number,
    @Body() body: UpdatePollDto,
  ): Promise<R.UpdateRsp> {

    const { form, relations } = body satisfies R.UpdateRqs;

    const poll = await this.service.get(id);
    if (poll.author_id !== user.id) {
      throw new err.ForbiddenE("only author can update poll");
    }
    const updated = await this.service.update(id, form, relations);
    return updated;
  }

  @Get("/:id")
  async get(
    @User() user: UserT|null,
    @Param("id", ParseIntPipe) id: number,
    @Query() query: GetPollDto,
  ): Promise<R.GetRsp> {

    const getOpt = query satisfies R.GetRqs;
    if (user) {
      getOpt.userId = user.id;
    }

    const fetched = await this.service.get(id, getOpt);
    return { data: fetched };
  }

}