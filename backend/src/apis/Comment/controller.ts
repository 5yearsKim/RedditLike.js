import {
  Controller, Post, Get, Patch, Delete,
  Body, Param, Query, UseGuards,
  ParseIntPipe,
} from "@nestjs/common";
import { User } from "@/apis/$decorators";
import { UserGuard, SystemGuard, checkManager, checkAdmin } from "@/apis/$guards";

import {
  CreateCommentDto,
  GetCommentDto,
  ListCommentDto,
  UpdateCommentDto,
  SkimCommentDto,
  GetWithChildrenDto,
  TrashCommentDto,
  TrashAdminCommentDto,
} from "./dtos";
import { notifier } from "@/runners";
import type * as R from "@/types/Comment.api";
import type { UserT } from "@/types/User";
import { CommentService } from "./service";
import { CommentManagingLogService } from "../CommentManagingLog/service";
import { PostService } from "../Post/service";
import * as err from "@/errors";


@Controller("comments")
export class CommentController {
  constructor(
    private readonly service: CommentService,
    private readonly logService: CommentManagingLogService,
    private readonly postService: PostService,

  ) {}

  @Get("/")
  async list(
    @User() user: UserT|null,
    @Query() query: ListCommentDto,
  ): Promise<R.ListRsp> {
    const listOpt = query satisfies R.ListRqs;
    if (user) {
      listOpt.userId = user.id;
    }
    const { data, nextCursor } = await this.service.list(listOpt);
    return { data, nextCursor };
  }

  @UseGuards(UserGuard)
  @Post("/")
  async create(
    @User() user: UserT,
    @Body() body: CreateCommentDto,
  ): Promise<R.CreateRsp> {
    const { form } = body;
    if (form.author_id !== user.id) {
      throw new err.ForbiddenE("author id not matching");
    }
    const created = await this.service.create(form);

    // update aggr
    if (created.parent_id) {
      this.service.updateAggr(created.parent_id, { numChildren: true });
    }
    this.postService.updateAggr(created.post_id, { numComment: true });

    // notifier
    const post = await this.service.getPost(created.post_id);
    if (created.parent_id) {
      const parent = await this.service.get(created.parent_id, {});
      notifier.commentOnComment(post, created, parent);
    } else {
      notifier.commentOnPost(post, created);
    }
    return created;
  }


  @Get("/skim")
  async skim(
    @User() user: UserT|null,
    @Query() query: SkimCommentDto,
  ): Promise<R.SkimRsp> {
    const listOpt = query satisfies R.SkimRqs;
    if (user) {
      listOpt.userId = user.id;
    }
    const rsp = await this.service.skim(listOpt);
    return rsp;
  }

  @Get("/:id/with-children")
  async getWithChildren(
    @User() user: UserT|null,
    @Param("id", ParseIntPipe) id: idT,
    @Query() query: GetWithChildrenDto,
  ): Promise<R.GetWithChildrenRsp> {
    const listOpt = query satisfies R.GetWithChildrenRqs;
    if (user) {
      listOpt.userId = user.id;
    }
    const comment = await this.service.getWithChildren(id, listOpt);
    return { data: comment };
  }

  @Get("/:id")
  async get(
    @User() user: UserT,
    @Param("id", ParseIntPipe) id: idT,
    @Query() query: GetCommentDto,
  ): Promise<R.GetRsp> {
    const getOpt = query satisfies R.GetRqs;
    if (user) {
      getOpt.userId = user.id;
    }
    const comment = await this.service.get(id, getOpt);
    return { data: comment };
  }


  @Patch("/:id")
  async update(
    @User() user: UserT,
    @Param("id", ParseIntPipe) id: idT,
    @Body() body: UpdateCommentDto,
  ): Promise<R.UpdateRsp> {
    const comment = await this.service.get(id, {});
    if (comment.author_id !== user.id) {
      throw new err.ForbiddenE("author id not matching");
    }
    const { form } = body;
    const updated = await this.service.update(id, form);
    return updated;
  }

  @Delete("/:id")
  async delete(
    @User() user: UserT,
    @Param("id", ParseIntPipe) id: idT,
  ): Promise<R.DeleteRsp> {
    const comment = await this.service.get(id, { $defaults: true });
    if (comment.author_id !== user.id) {
      throw new err.ForbiddenE("author id not matching");
    }
    if (comment.num_children) {
      const updated = await this.service.update(id, { deleted_at: "NOW()" as any });
      return updated;
    } else {
      const deleted = await this.service.remove(id);
      return deleted;
    }
  }

  @UseGuards(UserGuard)
  @Patch("/:id/approve")
  async approve(
    @User() user: UserT,
    @Param("id", ParseIntPipe) id: idT,
  ): Promise<R.ApproveRsp> {
    const comment = await this.service.get(id, { $post: true });
    await checkManager(user.id, comment.post!.board_id, { manage_censor: true });

    const updated = await this.service.update(id, {
      approved_at: "NOW()" as any,
      trashed_at: null,
    });
    const log = await this.logService.create({
      board_id: comment.post!.board_id,
      user_id: user.id,
      comment_id: id,
      type: "approve",
      managed_by: "board",
      memo: null,
    });
    return { comment: updated, log };
  }

  @UseGuards(UserGuard)
  @Patch("/:id/trash")
  async trash(
    @User() user: UserT,
    @Param("id", ParseIntPipe) id: idT,
    @Body() body: TrashCommentDto,
  ): Promise<R.TrashRsp> {
    const { reason } = body satisfies R.TrashRqs;

    const comment = await this.service.get(id, { $post: true });
    await checkManager(user.id, comment.post!.board_id, { manage_censor: true });

    const updated = await this.service.update(id, {
      trashed_at: "NOW()" as any,
      approved_at: null,
    });
    const log = await this.logService.create({
      board_id: comment.post!.id,
      user_id: user.id,
      comment_id: id,
      type: "trash",
      managed_by: "board",
      memo: reason,
    });

    notifier.trashComment(log, updated);

    return { comment: updated, log };
  }

  @UseGuards(UserGuard)
  @Patch("/:id/admin-trash")
  async adminTrash(
    @User() user: UserT,
    @Param("id", ParseIntPipe) id: idT,
    @Body() body: TrashAdminCommentDto,
  ): Promise<R.AdminTrashRsp> {
    const { reason } = body satisfies R.AdminTrashRqs;

    const board = await this.service.getBoard(id);
    await checkAdmin(user.id, { manage_censor: true });

    const updated = await this.service.update(id, {
      trashed_at: "NOW()" as any,
      trashed_by: "admin",
      approved_at: null,
    });
    const log = await this.logService.create({
      board_id: board.id,
      user_id: user.id,
      comment_id: id,
      type: "trash",
      managed_by: "admin",
      memo: reason,
    });

    notifier.trashComment(log, updated);

    return { comment: updated, log };
  }


  @UseGuards(SystemGuard)
  @Post("/update-aggr-all")
  async updateAggrAll() {
    await this.service.updateAggrAll();
    return true;
  }
}