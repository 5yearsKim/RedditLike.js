import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, Query,
  UseGuards, ParseIntPipe,
} from "@nestjs/common";
import { UserService } from "./service";
import { User } from "@/apis/$decorators";
import { UserGuard } from "@/apis/$guards";
import * as err from "@/errors";
import {
  CreateUserDto,
  UpdateUserMeDto,
  ListUserDto,
  AccessUserDto,
  GetMeDto,
} from "./dtos";
import type * as R from "@/types/User.api";
import type { UserT } from "@/types";


@Controller("users")
export class UserController {
  constructor(
    private readonly service: UserService,
  ) {}

  // @UseGuards(AccountGuard)
  // @Post("/")
  // async create(
  //   @Body() body: CreateUserDto
  // ): Promise<R.CreateRsp> {

  //   const { form } = body satisfies R.CreateRqs;
  //   const created = await this.service.create(form);
  //   return created;
  // }

  @UseGuards(UserGuard)
  @Get("/")
  async list(
    @User() user: UserT|null,
    @Query() query: ListUserDto,
  ): Promise<R.ListRsp> {

    const listOpt = query satisfies R.ListRqs;
    if (user) {
      listOpt.userId = user.id;
    }
    const fetched = await this.service.list(listOpt);

    return fetched;
  }


  @UseGuards(UserGuard)
  @Get("/me")
  async getMe(
    @User() user: UserT,
    @Query() query: GetMeDto,
  ): Promise<R.GetMeRsp> {

    const getOpt = query satisfies R.GetMeRqs;
    const fetched = await this.service.get(user.id, getOpt);
    return { data: fetched };
  }

  @UseGuards(UserGuard)
  @Patch("/me")
  async updateMe(
    @User() user: UserT,
    @Body() body: UpdateUserMeDto,
  ): Promise<R.UpdateMeRsp> {

    const { form } = body satisfies R.UpdateMeRqs;

    const updated = await this.service.update(user.id, form);
    return updated;
  }

  @UseGuards(UserGuard)
  @Delete("/me")
  async deleteMe(
    @User() user: UserT,
  ): Promise<R.DeleteMeRsp> {

    const deleted = await this.service.deleteMe(user.id);
    return deleted;
  }


}

