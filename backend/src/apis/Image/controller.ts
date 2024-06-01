import { Controller, Post, Body, UseGuards } from "@nestjs/common";
import { UserGuard } from "@/apis/$guards";
import { ImageService } from "./service";
import {
  CreateImageDto
} from "./dtos";
import * as R from "@/types/Image.api";


@Controller("images")
export class ImageController {
  constructor(private readonly service: ImageService) {}

  @UseGuards(UserGuard)
  @Post("/")
  async create(@Body() body: CreateImageDto): Promise<R.CreateRsp> {
    const { form } = body satisfies R.CreateRqs;
    const created = await this.service.create(form);
    return created;
  }

}