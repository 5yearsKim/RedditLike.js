import {
  Controller, Post, Get, Patch, Delete,
  Body, Param, Query,
  ParseIntPipe, UseGuards,
} from "@nestjs/common";
import { UserGuard, SystemGuard, checkManager, checkAdmin } from "@/apis/$guards";
import { User } from "@/apis/$decorators";
import type { UserT } from "@/types/User";
import { PostService } from "./service";
import { PostManagingLogService } from "../PostManagingLog/service";
import { BoardService } from "../Board/service";
import {
  CreatePostDto,
  GetPostDto,
  UpdatePostDto,
  ListPostDto,
  TrashPostDto,
  GetImagePresignedUrlDto,
  GetVideoPresignedUrlDto,
} from "./dtos";
import { notifier } from "@/runners";
import type * as R from "@/types/Post.api";
import * as err from "@/errors";


@Controller("posts")
export class PostController {
  constructor(
    private readonly service: PostService,
    private readonly logService: PostManagingLogService,
    private readonly boardService: BoardService,
  ) {}

  @UseGuards(UserGuard)
  @Post("/")
  async create(
    @User() user: UserT,
    @Body() body: CreatePostDto
  ): Promise<R.CreateRsp> {

    const { form, relations } = body satisfies R.CreateRqs;
    if (form.author_id !== user.id) {
      throw new err.ForbiddenE("author_id must be the same as yours");
    }
    const created = await this.service.create(form, relations);

    this.service.updateAggr(created.id, { hotScore: true })
      .catch(e => console.warn("error updating post aggrs: ", e));

    if (created.published_at) {
      this.boardService.updateAggrs(created.board_id, { hot_score: true, num_post: true })
        .catch(e => console.warn("error updating board aggrs: ", e));
    }

    return created;
  }

  @Get("/")
  async list(
    @User() user: UserT|null,
    @Query() listOpt: ListPostDto,
  ): Promise<R.ListRsp> {

    listOpt satisfies R.ListRqs;
    if (user) {
      listOpt.userId = user.id;
    }
    const listRsp = await this.service.list(listOpt);
    return listRsp;
  }

  @UseGuards(UserGuard)
  @Post("/images/presigned-url")
  async getImagePresignedUrl(@Body() body: GetImagePresignedUrlDto): Promise<R.ImagePresignedUrlRsp> {
    const { mimeType } = body satisfies R.ImagePresignedUrlRqs;

    const { putUrl, key } = await this.service.getImagePresignedUrl(mimeType);

    return { putUrl, key };
  }

  @UseGuards(UserGuard)
  @Post("/videos/presigned-url")
  async getVideoPresignedUrl(@Body() body: GetVideoPresignedUrlDto): Promise<R.VideoPresignedUrlRsp> {
    const { mimeType } = body satisfies R.VideoPresignedUrlRqs;

    const { putUrl, key } = await this.service.getVideoPresignedUrl(mimeType);

    return { putUrl, key };
  }


  @Get("/:id")
  async get(
    @User() user: UserT|null,
    @Param("id", ParseIntPipe) id: idT,
    @Query() getOpt: GetPostDto,
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
    @Query() getOpt: GetPostDto
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
    @Body() body: UpdatePostDto,
    @Param("id", ParseIntPipe) id: idT,
  ): Promise<R.UpdateRsp> {

    body satisfies R.UpdateRqs;
    const item = await this.service.get(id);
    if (item.author_id !== user.id) {
      throw new err.ForbiddenE("author_id must be the same as yours");
    }

    const { form, relations } = body;
    const updated = await this.service.update(id, form, relations);

    this.service.updateAggr(updated.id, { hotScore: true, voteInfo: true })
      .catch((e) => console.log("posts/:id (PATCH) error: ", e));

    return updated;
  }

  @UseGuards(UserGuard)
  @Delete("/:id")
  async delete(
    @User() user: UserT,
    @Param("id", ParseIntPipe) id: idT,
  ): Promise<R.DeleteRsp> {

    const item = await this.service.get(id);
    if (item.author_id !== user.id) {
      throw new err.ForbiddenE("author_id must be the same as yours");
    }

    const deleted = await this.service.delete(id);

    return deleted;
  }

  @UseGuards(UseGuards)
  @Patch("/:id/approve")
  async approve(
    @User() user: UserT,
    @Param("id", ParseIntPipe) id: idT,
  ): Promise<R.ApproveRsp> {
    const item = await this.service.get(id);
    await checkManager(user.id, item.board_id, { manage_censor: true });

    const updated = await this.service.update(id, {
      approved_at: "NOW()" as any,
      trashed_at: null,
    });
    const log = await this.logService.create({
      board_id: item.board_id,
      user_id: user.id,
      post_id: id,
      type: "approve",
      managed_by: "board",
      memo: null,
    });
    return { post: updated, log };
  }

  @UseGuards(UserGuard)
  @Patch("/:id/trash")
  async trash(
    @User() user: UserT,
    @Param("id", ParseIntPipe) id: idT,
    @Body() body: TrashPostDto,
  ): Promise<R.TrashRsp> {
    const { reason } = body satisfies R.TrashRqs;
    const item = await this.service.get(id);
    await checkManager(user.id, item.board_id, { manage_censor: true });

    const updated = await this.service.update(id, {
      trashed_at: "NOW()" as any,
      trashed_by: "manager",
      approved_at: null,
    });
    const log = await this.logService.create({
      board_id: item.board_id,
      user_id: user.id,
      post_id: id,
      managed_by: "board",
      type: "trash",
      memo: reason,
    });

    notifier.trashPost(log, updated);

    return { post: updated, log };
  }

  @UseGuards(UserGuard)
  @Patch("/:id/admin-trash")
  async adminTrash(
    @User() user: UserT,
    @Param("id", ParseIntPipe) id: idT,
    @Body() body: TrashPostDto,
  ): Promise<R.AdminTrashRsp> {
    const { reason } = body satisfies R.AdminTrashRqs;
    const item = await this.service.get(id, { $board: true });

    await checkAdmin(user.id, item.board!.group_id!, { manage_censor: true } );

    const updated = await this.service.update(id, {
      trashed_at: "NOW()" as any,
      approved_at: null,
      trashed_by: "admin",
    });
    const log = await this.logService.create({
      board_id: item.board_id,
      user_id: user.id,
      post_id: id,
      type: "trash",
      managed_by: "admin",
      memo: reason,
    });

    notifier.trashPost(log, updated);

    return { post: updated, log };
  }

  @UseGuards(SystemGuard)
  @Post("/update-aggr-all")
  async updateAggrAll() {
    await this.service.updateAggrAll();
    return true;
  }
}