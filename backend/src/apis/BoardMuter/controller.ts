import {
  Controller, Get, Post, Patch, Delete,
  Body, Query, Param,
  UseGuards, ParseIntPipe,
} from "@nestjs/common";
import { UserGuard, checkManager } from "@/apis/$guards";
import { User } from "@/apis/$decorators";
import { BoardMuterService } from "./service";
import type { UserT } from "@/types";
import {
  CreateBoardMuterDto,
  UpdateBoardMuterDto,
  GetBoardMuterDto,
  ListBoardMuterDto,

} from "./dtos";
import type * as R from "@/types/BoardMuter.api";

@Controller("board-muters")
export class BoardMuterController {
  constructor(private readonly service: BoardMuterService) {}

  @Get("/")
  async list(
    @Query() query: ListBoardMuterDto,
  ): Promise<R.ListRsp> {
    const listOpt = query satisfies R.ListRqs;
    const listRsp = await this.service.list(listOpt);
    return listRsp;
  }

  @UseGuards(UserGuard)
  @Post("/")
  async create(
    @User() user: UserT,
    @Body() body: CreateBoardMuterDto,
  ): Promise<R.CreateRsp> {
    const { form } = body satisfies R.CreateRqs;
    await checkManager(user.id, form.board_id, { manage_muter: true });

    const created = await this.service.create(form);
    return created;
  }


  @UseGuards(UserGuard)
  @Delete("/:id")
  async delete(
    @User() user: UserT,
    @Param("id", ParseIntPipe ) id: idT,
  ): Promise<R.DeleteRsp> {

    const muter = await this.service.get(id);
    await checkManager(user.id, muter.board_id, { manage_muter: true });

    const deleted = await this.service.delete(id);
    return deleted;
  }

  @UseGuards(UserGuard)
  @Patch("/:id")
  async update(
    @User() user: UserT,
    @Param("id", ParseIntPipe) id: idT,
    @Body() body: UpdateBoardMuterDto,
  ): Promise<R.UpdateRsp> {

    const { form } = body satisfies R.UpdateRqs;

    const muter = await this.service.get(id);
    await checkManager(user.id, muter.board_id, { manage_muter: true });

    const updated = await this.service.update(id, form );
    return updated;
  }

  @Get("/:id")
  async get(
    @Param("id", ParseIntPipe ) id: number,
    @Query() query: GetBoardMuterDto,
  ): Promise<R.GetRsp> {

    const getOpt: R.GetRqs = query;
    const muter = await this.service.get(id, getOpt);

    return { data: muter };
  }
}