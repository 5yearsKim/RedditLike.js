import {
  Controller, Post, Get,
  Body, Query,
  UseGuards,
} from "@nestjs/common";
import { UserGuard } from "@/apis/$guards";
import { User } from "@/apis/$decorators";
import {
  GetThumbnailPresignedUrlDto,
} from "./dtos";
import { PollCandService } from "./service";
import type * as R from "@/types/PollCand.api";
import type { UserT } from "@/types";

@Controller("poll-cands")
export class PollCandController {
  constructor(private readonly service: PollCandService) {}

  @Get("/")
  async list(
    @User() user: UserT|null,
    @Query() query: R.ListRqs,
  ): Promise<R.ListRsp> {

    const listOpt = query satisfies R.ListRqs;
    if (user) {
      listOpt.userId = user.id;
    }
    const { data, nextCursor } = await this.service.list(listOpt);
    return { data, nextCursor };
  }


  @UseGuards(UserGuard)
  @Post("/thumbnail/presigned-url")
  async getThumbnailPresignedUrl(
    @Body() body: GetThumbnailPresignedUrlDto
  ): Promise<R.ThumbnailPresignedUrlRsp> {

    const { mimeType } = body satisfies R.ThumbnailPresignedUrlRqs;

    const { putUrl, key } = await this.service.getThumbPresignedUrl(mimeType);

    return { putUrl, key };
  }

}