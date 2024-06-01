import { Controller, Post, Body, Param, Query, UseGuards } from "@nestjs/common";
import { UserGuard } from "@/apis/$guards";
import {
  CreateVideoDto,
} from "./dtos";
import * as R from "@/types/Video.api";
import { VideoService } from "./service";


@Controller("videos")
export class VideoController {
  constructor(private readonly service: VideoService) {}

  @UseGuards(UserGuard)
  @Post("/")
  async create(@Body() body: CreateVideoDto): Promise<R.CreateRsp> {
    const { form } = body satisfies R.CreateRqs;
    const created = await this.service.create(form);
    return created;
  }
}