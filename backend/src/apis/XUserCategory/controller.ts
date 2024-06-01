import {
  Controller, Post, Delete,
  Body,
  UseGuards,
} from "@nestjs/common";
import { User } from "@/apis/$decorators";
import { UserGuard } from "../$guards";
import { XUserCategoryService } from "./service";
import {
  CreateDto,
  DeleteDto,
} from "./dtos";
import type * as R from "@/types/XUserCategory.api";
import type { UserT } from "@/types";


@Controller("x-user-category")
export class XUserCategoryController {
  constructor(private readonly service: XUserCategoryService) {}

  @UseGuards(UserGuard)
  @Post("/")
  async create(
    @User() user: UserT,
    @Body() body: CreateDto,
  ): Promise<R.CreateRsp> {
    const { categoryId } = body satisfies R.CreateRqs;
    const created = await this.service.create(user.id, categoryId);
    return created;
  }

  @UseGuards(UserGuard)
  @Delete("/")
  async delete(
    @User() user: UserT,
    @Body() body: DeleteDto,
  ): Promise<R.DeleteRsp> {
    const { categoryId } = body satisfies R.DeleteRqs;
    const deleted = await this.service.delete(user.id, categoryId);
    return deleted;
  }

}