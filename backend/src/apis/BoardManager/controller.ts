import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, Query,
  UseGuards, ParseIntPipe
} from "@nestjs/common";
import { UserGuard, checkManager } from "@/apis/$guards";
import { User } from "@/apis/$decorators";
import { BoardManagerService } from "./service";
import {
  GetBoardManagerDto,
  CreateBoardManagerDto,
  UpdateBoardManagerDto,
  ListBoardManagerDto,
} from "./dtos";
import { notifier } from "@/runners";
import type * as R from "@/types/BoardManager.api";
import type { UserT } from "@/types";


@Controller("board-managers")
export class BoardManagerController {
  constructor(private readonly service: BoardManagerService) {}

  @UseGuards(UserGuard)
  @Post("/")
  async create(
    @User() user: UserT,
    @Body() body: CreateBoardManagerDto,
  ): Promise<R.CreateRsp> {

    const { form } = body satisfies R.CreateRqs;
    await checkManager(user.id, form.board_id, { manage_manager: true });
    const created = await this.service.create(form);

    notifier.createManager(created);

    return created;
  }

  @Get("/")
  async list(@Query() query: ListBoardManagerDto): Promise<R.ListRsp> {
    const listOpt = query satisfies R.ListRqs;
    const listRsp = await this.service.list(listOpt);
    return listRsp;
  }

  @Get("/boards/:boardId/me")
  async getMe(
    @User() user: UserT|null,
    @Param("boardId", ParseIntPipe ) boardId: number,
  ): Promise<R.GetMeRsp> {
    if (!user) {
      return { data: null };
    }
    const manager = await this.service.getByUser(user.id, boardId);
    return { data: manager };
  }

  @UseGuards(UserGuard)
  @Delete("/:id")
  async delete(
    @User() user: UserT,
    @Param("id", ParseIntPipe ) id: number,
  ): Promise<R.DeleteRsp> {

    const manager = await this.service.get(id);
    await checkManager(user.id, manager.board_id, { manage_manager: true });

    const deleted = await this.service.delete(id);

    notifier.deleteManager(deleted);

    return deleted;
  }

  @UseGuards(UserGuard)
  @Patch("/:id")
  async update(
    @User() user: UserT,
    @Param("id", ParseIntPipe ) id: number,
    @Body() body: UpdateBoardManagerDto,
  ): Promise<R.UpdateRsp> {
    const { form } = body satisfies R.UpdateRqs;

    const manager = await this.service.get(id);
    await checkManager(user.id, manager.board_id, { manage_manager: true });

    const updated = await this.service.update(id, form);
    return updated;
  }

  @Get("/:id")
  async get(
    @Param("id", ParseIntPipe ) id: number,
    @Query() query: GetBoardManagerDto,
  ): Promise<R.GetRsp> {
    const getOpt = query satisfies R.GetRqs;
    const manager = await this.service.get(id, getOpt);
    return { data: manager };
  }
}