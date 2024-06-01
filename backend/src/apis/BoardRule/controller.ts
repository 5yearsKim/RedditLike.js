import {
  Controller, Post, Get, Delete, Put,
  Body, Patch, Param, Query,
  UseGuards, ParseIntPipe,
} from "@nestjs/common";
import { BoardRuleService } from "./service";
import { UserGuard, checkManager } from "@/apis/$guards";
import { User } from "@/apis/$decorators";
import type { UserT } from "@/types/User";
import type * as R from "@/types/BoardRule.api";
import {
  CreateBoardRuleDto,
  UpdateBoardRuleDto,
  ListBoardRuleDto,
  RerankBoardRuleDto,
} from "./dtos";


@Controller("board-rules")
export class BoardRuleController {
  constructor(private readonly service: BoardRuleService) {}

  @Get("/")
  async list(
    @Query() listOpt: ListBoardRuleDto,
  ): Promise<R.ListRsp> {

    listOpt satisfies R.ListRqs;
    const listRsp = await this.service.list(listOpt);
    return listRsp;
  }

  @UseGuards(UserGuard)
  @Post("/")
  async create(
    @User() user: UserT,
    @Body() body: CreateBoardRuleDto,
  ): Promise<R.CreateRsp> {

    const { form } = body satisfies R.CreateRqs;
    await checkManager(user.id, form.board_id, { manage_info: true });
    const created = await this.service.create(form);

    return created;
  }

  @UseGuards(UserGuard)
  @Patch("/:id")
  async update(
    @User() user: UserT,
    @Param("id", ParseIntPipe) id: idT,
    @Body() body: UpdateBoardRuleDto,
  ): Promise<R.UpdateRsp> {

    const { form } = body satisfies R.UpdateRqs;
    const rule = await this.service.get(id);
    await checkManager(user.id, rule.board_id, { manage_info: true });
    const updated = await this.service.update(id, form);

    return updated;
  }

  @UseGuards(UserGuard)
  @Delete("/:id")
  async delete(
    @User() user: UserT,
    @Param("id", ParseIntPipe) id: idT,
  ): Promise<R.DeleteRsp> {

    const rule = await this.service.get(id);
    await checkManager(user.id, rule.board_id, { manage_info: true });
    const deleted = await this.service.delete(id);

    return deleted;
  }

  @UseGuards(UserGuard)
  @Put("/rerank")
  async rerank(
    @User() user: UserT,
    @Body() body: RerankBoardRuleDto,
  ): Promise<R.RerankRsp> {

    const { boardId, ruleIds } = body satisfies R.RerankRqs;
    await checkManager(user.id, boardId, { manage_info: true });
    const reranked = await this.service.rerank(boardId, ruleIds);

    return reranked;
  }

}