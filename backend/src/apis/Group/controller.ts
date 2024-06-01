import {
  Controller, Get, Post, Patch,
  Body, Param, Query,
  ParseIntPipe,
  UseGuards,
} from "@nestjs/common";
import { GroupService } from "./service";
import { AccountId } from "@/apis/$decorators";
import { UserGuard, AccountGuard, checkAdmin } from "@/apis/$guards";
import { User } from "@/apis/$decorators";
import {
  CreateGroupDto,
  GetGroupDto,
  GetByKeyGroupDto,
  ListGroupDto,
  UpdateGroupDto,
  GetAvatarPresignedUrlDto
} from "./dtos";
import type * as R from "@/types/Group.api";
import type { UserT } from "@/types";

@Controller("groups")
export class GroupController {
  constructor(private readonly service: GroupService ) {}

  @UseGuards(AccountGuard)
  @Post("/")
  async create(
    @AccountId() accountId: idT,
    @Body() body: CreateGroupDto,
  ): Promise<R.CreateRsp> {
    body satisfies R.CreateRqs;
    const created = this.service.create(body.form, accountId);
    return created;
  }

  @Get("/key/:key")
  async getByKey(
    @AccountId() accountId: idT|null,
    @Param("key") key: string,
    @Query() query: GetByKeyGroupDto,
  ): Promise<R.GetByKeyRsp> {

    const getOpt = query satisfies R.GetByKeyRqs;
    if (accountId) {
      getOpt.accountId = accountId;
    }
    const fetched = await this.service.getByKey(key, getOpt);

    return { data: fetched };
  }


  @Get("/")
  async list(
    @AccountId() accountId: idT|null,
    @Query() query: ListGroupDto,
  ): Promise<R.ListRsp> {

    const listOpt = query satisfies R.ListRqs;
    if (accountId) {
      listOpt.accountId = accountId;
    }
    const fetched = this.service.list(listOpt);

    return fetched;
  }

  @Get("/:id")
  async get(
    @AccountId() accountId: idT|null,
    @Param("id", ParseIntPipe) id: idT,
    @Query() query: GetGroupDto,
  ): Promise<R.GetRsp> {

    const getOpt = query satisfies R.GetRqs;
    if (accountId) {
      getOpt.accountId = accountId;
    }
    const fetched = await this.service.get(id);

    return { data: fetched };
  }

  @Patch("/:id")
  async patch(
    @Param("id", ParseIntPipe) id: idT,
    @Body() body: UpdateGroupDto,
  ): Promise<R.UpdateRsp> {

    const { form } = body satisfies R.UpdateRqs;
    const updated = await this.service.update(id, form);

    return updated;
  }

  @UseGuards(UserGuard)
  @Post("/avatar/presigned-url")
  async getAvatarPresignedUrl(
    @User() user: UserT,
    @Body() body: GetAvatarPresignedUrlDto,
  ): Promise<R.AvatarPresignedUrlRsp> {
    const { groupId, mimeType } = body satisfies R.AvatarPresignedUrlRqs;

    await checkAdmin(user.id, groupId, { manage_intro: true });
    const { putUrl, key } = await this.service.getAvatarPresignedUrl(groupId, mimeType);

    return { putUrl, key };
  }
}


