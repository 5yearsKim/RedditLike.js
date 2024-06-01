import {
  Controller, Get,
  Query,
} from "@nestjs/common";
import { ListCommentManagingLogDto } from "./dtos";
import type * as R from "@/types/CommentManagingLog.api";
import { CommentManagingLogService } from "./service";


@Controller("comment-managing-logs")
export class CommentManagingLogController {
  constructor(private readonly service: CommentManagingLogService) {}

  @Get("/")
  async list(
    @Query() query: ListCommentManagingLogDto,
  ): Promise<R.ListRsp>{
    const listOpt: R.ListRqs = query;
    const { data, nextCursor } = await this.service.list(listOpt);
    return { data, nextCursor };
  }
}