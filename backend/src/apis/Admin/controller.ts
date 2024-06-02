import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, Query,
  UseGuards, ParseIntPipe,
} from "@nestjs/common";
import { User } from "@/apis/$decorators";
import {
  CreateAdminDto,
  ListAdminDto,
  UpdateAdminDto,
  CreateAdminByEmailDto,
} from "./dtos";
import { UserGuard, checkAdmin } from "../$guards";
import { AdminService } from "./service";
import type * as R from "@/types/Admin.api";
import * as err from "@/errors";
import type { UserT } from "@/types";


@Controller("admins")
export class AdminController {
  constructor(private readonly service: AdminService) {}


  @UseGuards(UserGuard)
  @Post("/")
  async create(
    @User() user: UserT,
    @Body() body: CreateAdminDto,
  ): Promise<R.CreateRsp> {

    const { form } = body satisfies R.CreateRqs;
    await checkAdmin(user.id, { "manage_admin": true });
    const created = await this.service.create(form);
    return created;
  }

  @UseGuards(UserGuard)
  @Post("/by-email")
  async createByEmail(
    @User() user: UserT,
    @Body() body: CreateAdminByEmailDto,
  ): Promise<R.CreateByEmailRsp> {

    const { email } = body satisfies R.CreateByEmailRqs;
    await checkAdmin(user.id, { "manage_admin": true });
    const created = await this.service.createByEmail(email);

    return created;
  }

  @UseGuards(UserGuard)
  @Get("/")
  async list(
    @User() user: UserT,
    @Query() query: ListAdminDto,
  ): Promise<R.ListRsp> {

    const listOpt = query satisfies R.ListRqs;

    await checkAdmin(user.id, { "manage_admin": true });
    const fetched = await this.service.list(listOpt);

    return fetched;
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
  @Patch("/:id")
  async update(
    @User() user: UserT,
    @Param("id", ParseIntPipe) id: number,
    @Body() body: UpdateAdminDto,
  ): Promise<R.UpdateRsp> {

    const { form } = body satisfies R.UpdateRqs;
    await checkAdmin(user.id, { "manage_admin": true });
    const updated = await this.service.update(id, form);

    return updated;
  }

  @UseGuards(UserGuard)
  @Delete("/:id")
  async delete(
    @User() user: UserT,
    @Param("id", ParseIntPipe) id: number,
  ): Promise<R.DeleteRsp> {

    await checkAdmin(user.id, { "manage_admin": true });
    const deleted = await this.service.delete(id);

    return deleted;
  }

}