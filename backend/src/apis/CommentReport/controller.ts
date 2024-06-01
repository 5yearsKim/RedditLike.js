import {
  Controller, Post, Get, Patch,
  Param, Query, Body,
  UseGuards, ParseIntPipe,
} from "@nestjs/common";
import * as err from "@/errors";
import { User } from "@/apis/$decorators";
import { UserGuard } from "@/apis/$guards";
import {
  CreateCommentReportDto,
  ListCommentReportDto,
} from "./dtos";
import type * as R from "@/types/CommentReport.api";
import { CommentReportService } from "./service";
import type { UserT } from "@/types";


@Controller("comment-reports")
export class CommentReportController {
  constructor(private readonly service: CommentReportService) {}

  @UseGuards(UserGuard)
  @Post("/")
  async create(
    @User() user: UserT,
    @Body() body: CreateCommentReportDto
  ): Promise<R.CreateRsp> {
    const { form } = body satisfies R.CreateRqs;
    if (form.user_id !== user.id) {
      throw new err.ForbiddenE("Invalid user");
    }
    const created = await this.service.upsert(form);
    return created;
  }

  @Get("/")
  async list(
    @Query() query: ListCommentReportDto,
  ): Promise<R.ListRsp> {
    const listOpt = query satisfies R.ListRqs;
    const { data, nextCursor } = await this.service.list(listOpt);
    return { data, nextCursor };
  }


  // manager protection not implemented
  @UseGuards(UserGuard)
  @Patch("/:id/ignore")
  async ignore(
      @User() user: UserT,
      @Param("id", ParseIntPipe) id: idT,
  ): Promise<R.IgnoreRsp> {

    const updated = await this.service.update(id, { ignored_at: "NOW()" as any });
    return updated;
  }

  @UseGuards(UserGuard)
  @Patch("/:id/resolve")
  async resolve(
      @User() user: UserT,
      @Param("id", ParseIntPipe) id: idT,
  ): Promise<R.ResolveRsp> {

    const updated = await this.service.update(id, { resolved_at: "NOW()" as any });
    return updated;
  }

}
