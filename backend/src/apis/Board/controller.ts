import { Controller, Get, Post, Patch, Body, Param, Query, ParseIntPipe, UseGuards } from "@nestjs/common";
import { BoardService } from "./service";
import { BoardManagerService } from "../BoardManager/service";
import { User } from "@/apis/$decorators";
import { UserGuard, checkManager, checkAdmin, SystemGuard } from "@/apis/$guards";
import {
  CreateBoardDto,
  GetBoardDto,
  ListBoardDto,
  UpdateBoardDto,
  GetAvatarPresignedUrlDto,
  GetBgCoverPresignedUrlDto,
  GetDefaultAvatarPresignedUrlDto,
} from "./dtos";
import type * as R from "@/types/Board.api";
import type { UserT, BoardManagerT, } from "@/types";

@Controller("boards")
export class BoardController {
  constructor(
    private readonly service: BoardService,
    private readonly managerService: BoardManagerService,
  ) {}

  @UseGuards(UserGuard)
  @Post("/")
  async create(
    @User() user: UserT,
    @Body() body: CreateBoardDto
  ): Promise<R.CreateRsp> {

    const { form } = body satisfies R.CreateRqs;
    const created = await this.service.create(form);

    await this.managerService.create({
      board_id: created.id,
      user_id: user.id,
      is_super: true,
    });

    return created;
  }

  @Get("/")
  async list(
    @User() user: UserT|null,
    @Query() listOpt: ListBoardDto
  ): Promise<R.ListRsp> {

    listOpt satisfies R.ListRqs;
    if (user) {
      listOpt.userId = user.id;
    }

    const fetched = await this.service.list(listOpt);

    return fetched;
  }

  @Get("/by-name/:name/group/:groupId")
  async nameUnique(
    @Param("name") name: string,
    @Param("groupId", ParseIntPipe) groupId: idT,
  ): Promise<R.ByNameAndGroupRsp> {

    const fetched = await this.service.getByNameAndGroup(name, groupId);

    return { data: fetched };
  }

  @UseGuards(UserGuard)
  @Post("/avatar/presigned-url")
  async getAvatarPresignedUrl(
    @User() user: UserT,
    @Body() body: GetAvatarPresignedUrlDto,
  ): Promise<R.AvatarPresignedUrlRsp> {
    const { boardId, mimeType } = body satisfies R.AvatarPresignedUrlRqs;

    await checkManager(user.id, boardId, { manage_intro: true });
    const { putUrl, key } = await this.service.getAvatarPresignedUrl(boardId, mimeType);

    return { putUrl, key };
  }

  @UseGuards(UserGuard)
  @Post("/bg-cover/presigned-url")
  async getBgCoverPresignedUrl(
    @User() user: UserT,
    @Body() body: GetBgCoverPresignedUrlDto,
  ) {
    const { boardId, mimeType } = body satisfies R.BgCoverPresignedUrlRqs;

    await checkManager(user.id, boardId, { manage_intro: true });
    const { putUrl, key } = await this.service.getBgCoverPresignedUrl(boardId, mimeType);

    return { putUrl, key };
  }

  @UseGuards(UserGuard)
  @Post("/default-avatar/presigned-url")
  async getDefaultAvatarPresignedUrl(
    @User() user: UserT,
    @Body() body: GetDefaultAvatarPresignedUrlDto,
  ) {
    const { boardId, mimeType } = body satisfies R.DefaultAvatarPresignedUrlRqs;

    await checkManager(user.id, boardId, { manage_intro: true });
    const { putUrl, key } = await this.service.getDefaultAvatarPresignedUrl(boardId, mimeType);

    return { putUrl, key };
  }


  @Get("/:id")
  async get(
    @User() user: UserT|null,
    @Param("id", ParseIntPipe) id: idT,
    @Query() getOpt: GetBoardDto
  ): Promise<R.GetRsp> {

    getOpt satisfies R.GetRqs;
    if (user) {
      getOpt.userId = user.id;
    }
    const fetched = await this.service.get(id, getOpt);

    return { data: fetched };
  }


  @Get("/:id/group-check/:groupKey")
  async getWithGroupCheck(
    @User() user: UserT|null,
    @Param("id", ParseIntPipe) id: idT,
    @Param("groupKey") groupKey: string,
    @Query() getOpt: GetBoardDto
  ): Promise<R.GetRsp> {

    getOpt satisfies R.GetRqs;
    if (user) {
      getOpt.userId = user.id;
    }
    const fetched = await this.service.getWithGroupCheck(id, groupKey, getOpt);

    return { data: fetched };
  }


  @UseGuards(UserGuard)
  @Patch("/:id")
  async update(
    @User() user: UserT,
    @Param("id", ParseIntPipe) id: idT,
    @Body() body: UpdateBoardDto,
  ): Promise<R.UpdateRsp> {

    const { form } = body satisfies R.UpdateRqs;

    const roles: Partial<BoardManagerT> = {
    };

    if (
      form.use_nsfw !== undefined ||
      form.use_spoiler !== undefined
    ) {
      roles.manage_etc = true;
    }
    if (
      form.allow_multiple_flag !== undefined ||
      form.force_flag !== undefined
    ) {
      roles.manage_contents = true;
    }
    if (form.force_flair !== undefined) {
      roles.manage_exposure = true;
    }

    await checkManager(user.id, id, roles);
    const updated = await this.service.update(id, form);

    return updated;
  }

  @UseGuards(UserGuard)
  @Patch("/:id/admin-trash")
  async adminTrash(
    @User() user: UserT,
    @Param("id", ParseIntPipe) id: idT,
  ): Promise<R.AdminTrashRsp> {

    const board = await this.service.get(id, {});
    await checkAdmin(user.id, board.group_id, { manage_censor: true });
    const updated = await this.service.update(id, {
      trashed_at: new Date(),
      trashed_by: "admin",
    });

    return updated;
  }

  @UseGuards(UserGuard)
  @Patch("/:id/admin-restore")
  async adminRestore(
    @User() user: UserT,
    @Param("id", ParseIntPipe) id: idT,
  ): Promise<R.AdminRestoreRsp> {

    const board = await this.service.get(id, {});
    await checkAdmin(user.id, board.group_id, { manage_censor: true });
    const updated = await this.service.update(id, {
      trashed_at: null,
      trashed_by: null,
    });

    return updated;
  }

  @UseGuards(SystemGuard)
  @Post("/update-aggr-all")
  async updateAggrAll() {
    await this.service.updateAggrAll();
    return true;
  }
}