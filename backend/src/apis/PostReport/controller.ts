import {
  Controller, Post, Get, Patch,
  Body, Param, Query,
  UseGuards, ParseIntPipe,
} from "@nestjs/common";
import { UserGuard } from "@/apis/$guards";
import { User } from "@/apis/$decorators";
import {
  CreatePostReportDto,
  ListPostReportDto,

} from "./dtos";
import { PostReportService } from "./service";
import type * as R from "@/types/PostReport.api";
import type { UserT } from "@/types";
import * as err from "@/errors";


@Controller("post-reports")
export class PostReportController {
  constructor(private readonly service: PostReportService) {}

  @UseGuards(UserGuard)
  @Post("/")
  async create(
    @User() user: UserT,
    @Body() body: CreatePostReportDto
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
    @Query() query: ListPostReportDto,
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