import {
  Controller, Get,
  Query,
} from "@nestjs/common";
import { PostManagingLogService } from "./service";
import {
  ListPostManagingLogDto,
} from "./dtos";
import type * as R from "@/types/PostManagingLog.api";


@Controller("post-managing-logs")
export class PostManagingLogController {
  constructor(private readonly service: PostManagingLogService) {}


  @Get("/")
  async list(@Query() query: ListPostManagingLogDto): Promise<R.ListRsp> {
    const listOpt: R.ListRqs = query;
    const { data, nextCursor } = await this.service.list(listOpt);
    return { data, nextCursor };
  }
}