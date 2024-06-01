import {
  Controller, Post, Delete,
  Query, Body, Param,
  UseGuards, ParseIntPipe,
} from "@nestjs/common";
import { BoardBlockService } from "./service";
import { UserGuard } from "@/apis/$guards";
import { User } from "@/apis/$decorators";
import {
  CreateDto,
} from "./dtos";
import type { UserT } from "@/types";
import type * as R from "@/types/BoardBlock.api";
import * as err from "@/errors";


@Controller("board-blocks")
export class BoardBlockController {
  constructor(private readonly service: BoardBlockService) {}

  @UseGuards(UserGuard)
  @Post("/")
  async create(@User() user: UserT, @Body() body: CreateDto): Promise<R.CreateRsp> {
    const { form } = body;
    if (form.user_id !== user.id) {
      throw new err.ForbiddenE("Invalid user");
    }
    const created = await this.service.create(form);
    return created;
  }

  @UseGuards(UserGuard)
  @Delete("/:id")
  async delete(
    @User() user: UserT,
    @Param("id", ParseIntPipe) id: number,
  ): Promise<R.DeleteRsp> {
    const boardBlock = await this.service.get(id);
    if (boardBlock.user_id !== user.id) {
      throw new err.ForbiddenE("Invalid user");
    }
    const deleted = await this.service.delete(id);
    return deleted;
  }
}