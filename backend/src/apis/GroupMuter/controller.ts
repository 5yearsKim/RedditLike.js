import {
  Controller, Post, Get, Delete,
  Body, Param, Query,
  UseGuards,
} from "@nestjs/common";
import { User } from "@/apis/$decorators";
import { UserGuard, checkAdmin } from "@/apis/$guards";
import { GroupMuterService } from "./service";
import {
  CreateGroupMuterDto,
  ListGroupMuterDto,
  GetMeGroupMuterDto,
} from "./dtos";
import * as err from "@/errors";
import type * as R from "@/types/GroupMuter.api";
import type { UserT } from "@/types";


@Controller("group-muters")
export class GroupMuterController {
  constructor(private readonly service: GroupMuterService) {}

  @UseGuards(UserGuard)
  @Post("/")
  async create(
    @User() user: UserT,
    @Body() body: CreateGroupMuterDto,
  ): Promise<R.CreateRsp> {
    const { form } = body satisfies R.CreateRqs;

    await checkAdmin(user.id, form.group_id, { manage_muter: true });
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
    if (!listOpt.groupId) {
      throw new err.InvalidDataE("groupId is required");
    }
    await checkAdmin(user.id, listOpt.groupId, { manage_muter: true });
    const { data, nextCursor } = await this.service.list(listOpt);
    return { data, nextCursor };
  }

  @UseGuards(UserGuard)
  @Get("/me")
  async getMe(
    @User() user: UserT,
    @Query() query: GetMeGroupMuterDto,
  ): Promise<R.GetMeRsp> {
    const { groupId } = query satisfies R.GetMeRqs;
    const fetched = await this.service.getMe(user.id, groupId);
    return { data: fetched };
  }


  @UseGuards(UserGuard)
  @Delete("/:id")
  async delete(
    @User() user: UserT,
    @Param("id") id: idT,
  ): Promise<R.DeleteRsp> {

    const muter = await this.service.get(id);
    await checkAdmin(user.id, muter.group_id, { manage_muter: true });
    const deleted = await this.service.delete(id);
    return deleted;
  }


}