import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, Query,
  UseGuards, ParseIntPipe,
} from "@nestjs/common";
import { User } from "@/apis/$decorators";
import {
  CreateGroupAdminDto,
  ListGroupAdminDto,
  UpdateGroupAdminDto,
  CreateGroupAdminByEmailDto,
  GetMeGroupAdminDto,
} from "./dtos";
import { UserGuard, checkAdmin } from "../$guards";
import { GroupAdminService } from "./service";
import type * as R from "@/types/GroupAdmin.api";
import * as err from "@/errors";
import type { UserT } from "@/types";


@Controller("group-admins")
export class GroupAdminController {
  constructor(private readonly service: GroupAdminService) {}


  @UseGuards(UserGuard)
  @Post("/")
  async create(
    @User() user: UserT,
    @Body() body: CreateGroupAdminDto,
  ): Promise<R.CreateRsp> {

    const { form } = body satisfies R.CreateRqs;
    await checkAdmin(user.id, body.form.group_id, { "manage_admin": true });
    const created = await this.service.create(form);
    return created;
  }

  @UseGuards(UserGuard)
  @Post("/by-email")
  async createByEmail(
    @User() user: UserT,
    @Body() body: CreateGroupAdminByEmailDto,
  ): Promise<R.CreateByEmailRsp> {

    const { groupId, email } = body satisfies R.CreateByEmailRqs;
    await checkAdmin(user.id, groupId, { "manage_admin": true });
    const created = await this.service.createByEmail(email, groupId);

    return created;
  }

  @UseGuards(UserGuard)
  @Get("/")
  async list(
    @User() user: UserT,
    @Query() query: ListGroupAdminDto,
  ): Promise<R.ListRsp> {

    const listOpt = query satisfies R.ListRqs;
    if (!listOpt.groupId) {
      throw new err.InvalidDataE("groupId is required");
    }

    await checkAdmin(user.id, listOpt.groupId, { "manage_admin": true });
    const fetched = await this.service.list(listOpt);

    return fetched;
  }

  @UseGuards(UserGuard)
  @Get("/me")
  async getMe(
    @User() user: UserT,
    @Query() query: GetMeGroupAdminDto,
  ): Promise<R.GetMeRsp> {

    const { groupId } = query satisfies R.GetMeRqs;
    const fetched = await this.service.getMe(user.id, groupId);

    return { data: fetched };
  }

  @UseGuards(UserGuard)
  @Patch("/:id")
  async update(
    @User() user: UserT,
    @Param("id", ParseIntPipe) id: number,
    @Body() body: UpdateGroupAdminDto,
  ): Promise<R.UpdateRsp> {

    const { form } = body satisfies R.UpdateRqs;
    const admin = await this.service.get(id);
    await checkAdmin(user.id, admin.group_id, { "manage_admin": true });
    const updated = await this.service.update(id, form);

    return updated;
  }

  @UseGuards(UserGuard)
  @Delete("/:id")
  async delete(
    @User() user: UserT,
    @Param("id", ParseIntPipe) id: number,
  ): Promise<R.DeleteRsp> {

    const admin = await this.service.get(id);
    await checkAdmin(user.id, admin.group_id, { "manage_admin": true });
    const deleted = await this.service.delete(id);

    return deleted;
  }

}