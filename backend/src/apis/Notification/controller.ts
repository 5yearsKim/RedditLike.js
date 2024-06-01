import {
  Controller, Post, Get,
  Body, Param, Query,
  UseGuards,
} from "@nestjs/common";
import { User } from "@/apis/$decorators";
import { UserGuard } from "@/apis/$guards";
import {
  ListNotificationDto
} from "./dtos";
import { NotificationService } from "./service";
import type * as R from "@/types/Notification.api";
import type { UserT } from "@/types";


@Controller("notifications")
export class NotificationController {
  constructor(private readonly service: NotificationService) {}

  @UseGuards(UserGuard)
  @Get("/")
  async list(
    @User() user: UserT,
    @Query() query: ListNotificationDto
  ): Promise<R.ListRsp> {

    const listOpt: R.ListRqs = query;
    listOpt.userId = user.id;
    return await this.service.list(listOpt);
  }

  @UseGuards(UserGuard)
  @Post("/check")
  async check(
    @User() user: UserT,
  ): Promise<R.CheckRsp> {
    const checked = await this.service.checkUnread(user.id);
    return checked;
  }
}