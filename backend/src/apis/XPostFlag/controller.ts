import {
  Controller, Post,
  Body, Param, Query,
} from "@nestjs/common";
import { XPostFlagService } from "./service";
import {
  CreateXPostFlagDto
} from "./dtos";
import type * as R from "@/types/XPostFlag.api";


@Controller("x-post-flag")
export class XPostFlagController {
  constructor(private readonly service: XPostFlagService) {}

  @Post("/")
  async create(@Body() body: CreateXPostFlagDto): Promise<R.CreateRsp> {
    const { form } = body satisfies R.CreateRqs;
    const created = await this.service.create(form);
    return created;
  }
}