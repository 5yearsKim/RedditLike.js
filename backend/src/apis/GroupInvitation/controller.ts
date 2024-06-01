import {
  Controller, Post, Get, Delete,
  Body, Query, Param,
  UseGuards, ParseIntPipe,
} from "@nestjs/common";
import { UserGuard, checkAdmin } from "@/apis/$guards";
import { User } from "@/apis/$decorators";
import { GroupInvitationService } from "./service";
import {
  ListGroupInvitationDto,
  InviteDto,
} from "./dtos";
import * as err from "@/errors";
import type * as R from "@/types/GroupInvitation.api";
import type { UserT } from "@/types";


@Controller("group-invitations")
export class GroupInvitationController {
  constructor(private readonly service: GroupInvitationService) {}

  @Get("/")
  async list(
    @User() user: UserT|null,
    @Query() query: ListGroupInvitationDto,
  ): Promise<R.ListRsp> {
    const listOpt = query satisfies R.ListRqs;

    if (!listOpt.groupId) {
      throw new err.InvalidDataE("groupId is required");
    }
    if (user) {
      listOpt.userId = user.id;
    }

    const { data, nextCursor } = await this.service.list(listOpt);

    return { data, nextCursor };
  }

  @UseGuards(UserGuard)
  @Post("/invite")
  async invite(
    @User() user: UserT,
    @Body() body: InviteDto,
  ): Promise<R.InviteRsp> {

    const { groupId, email } = body satisfies R.InviteRqs;

    await checkAdmin(user.id, groupId, { manage_member: true });
    const { status, invitation } = await this.service.invite(groupId, email);

    return { status, invitation };
  }

  @UseGuards(UserGuard)
  @Delete("/:id")
  async remove(
    @User() user: UserT,
    @Param("id", ParseIntPipe) id: idT,
  ): Promise<R.DeleteRsp> {

    const invitation = await this.service.get(id);
    await checkAdmin(user.id, invitation.group_id, { manage_member: true });

    const deleted = await this.service.remove(id);
    return deleted;
  }

}