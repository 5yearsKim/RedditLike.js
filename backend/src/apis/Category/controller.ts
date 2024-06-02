import {
  Controller, Get, Post, Patch, Put, Delete,
  Query, Body, Param,
  UseGuards, ParseIntPipe,
} from "@nestjs/common";
import { User } from "@/apis/$decorators";
import { UserGuard, checkAdmin } from "../$guards";
import { CategoryService } from "./service";
import {
  GetCategoryDto,
  CreateCategoryDto,
  UpdateCategoryDto,
  ListCategoryDto,
  RerankCategoryDto,
} from "./dtos";
import type * as R from "@/types/Category.api";
import { UserT } from "@/types";


@Controller("categories")
export class CategoryController {
  constructor(private readonly service: CategoryService) {}

  @Get("/")
  async list(
    @User() user: UserT|null,
    @Query() query: ListCategoryDto ,
  ): Promise<R.ListRsp> {
    const listOpt = query satisfies R.ListRqs;
    if (user) {
      listOpt.userId = user.id;
    }
    const { data, nextCursor } = await this.service.list(listOpt);
    return { data, nextCursor };
  }

  @UseGuards(UserGuard)
  @Post("/")
  async create(
    @User() user: UserT,
    @Body() body: CreateCategoryDto,
  ): Promise<R.CreateRsp> {

    const { form } = body satisfies R.CreateRqs;
    await checkAdmin(user.id, { manage_category: true } );
    const created = await this.service.create(form);
    return created;
  }

  @UseGuards(UserGuard)
  @Put("/rerank")
  async rerank(
    @User() user: UserT,
    @Body() body: RerankCategoryDto,
  ): Promise<R.RerankRsp> {

    const { categoryIds } = body satisfies R.RerankRqs;
    await checkAdmin(user.id, { manage_category: true } );
    const reranked = await this.service.rerank(categoryIds);
    return reranked;
  }

  @Get("/:id")
  async get(
    @User() user: UserT|null,
    @Param("id", ParseIntPipe) id: number,
    @Query() query: GetCategoryDto,
  ): Promise<R.GetRsp> {

    const getOpt = query satisfies R.GetRqs;
    if (user) {
      getOpt.userId = user.id;
    }
    const category = await this.service.get(id, getOpt);
    return { data: category };
  }

  @UseGuards(UserGuard)
  @Patch("/:id")
  async update(
    @User() user: UserT,
    @Param("id", ParseIntPipe) id: number,
    @Body() body: UpdateCategoryDto,
  ): Promise<R.UpdateRsp> {

    const { form } = body satisfies R.UpdateRqs;
    await checkAdmin(user.id, { manage_category: true } );
    const updated = await this.service.update(id, form);
    return updated;
  }

  @UseGuards(UserGuard)
  @Delete("/:id")
  async delete(
    @User() user: UserT,
    @Param("id", ParseIntPipe) id: number,
  ): Promise<R.DeleteRsp> {

    await checkAdmin(user.id, { manage_category: true } );
    const deleted = await this.service.delete(id);
    return deleted;
  }


}