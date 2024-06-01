import {
  Controller, Post, Patch, Delete, Put,
  Body, Param,
  UseGuards, ParseIntPipe,
} from "@nestjs/common";
import { UserGuard, checkManager } from "@/apis/$guards";
import { User } from "@/apis/$decorators";
import {
  CreateFlairDto,
  CreateCustomFlairDto,
  UpdateFlairDto,
  RerankFlairDto,
} from "./dtos";
import { FlairService } from "./service";
import { FlairBoxService } from "../FlairBox/service";
import * as err from "@/errors";
import type * as R from "@/types/Flair.api";
import type { UserT } from "@/types";


@Controller("flairs")
export class FlairController {
  constructor(
    private readonly service: FlairService,
    private readonly flairBoxService: FlairBoxService,
  ) {}


  @UseGuards(UserGuard)
  @Post("/custom")
  async createCustom(
    @User() user: UserT,
    @Body() body: CreateCustomFlairDto,
  ): Promise<R.CreateCustomRsp> {
    const { form } = body satisfies R.CreateCustomRqs;
    const flairBox = await this.flairBoxService.get(form.box_id);

    if (!flairBox.is_editable) {
      throw new err.ForbiddenE("Flair box is not editable");
    }
    form.creator_id = user.id;

    const created = await this.service.create(form);
    return created;
  }

  @UseGuards(UserGuard)
  @Delete("/custom/:id")
  async deleteCustom(
    @User() user: UserT,
    @Param("id", ParseIntPipe ) id: idT,
  ): Promise<R.DeleteCustomRsp> {
    const flair = await this.service.get(id);

    if (flair.creator_id !== user.id) {
      throw new err.ForbiddenE("Invalid user");
    }

    const deleted = await this.service.delete(id);
    return deleted;
  }

  @UseGuards(UserGuard)
  @Post("/")
  async create(
    @User() user: UserT,
    @Body() body: CreateFlairDto,
  ): Promise<R.CreateRsp> {
    const { form } = body satisfies R.CreateRqs;
    const flairBox = await this.flairBoxService.get(form.box_id);
    await checkManager(user.id, flairBox.board_id, { manage_exposure: true });

    const created = await this.service.create(form);
    return created;
  }

  @UseGuards(UserGuard)
  @Put("/rerank")
  async rerank(
    @User() user: UserT,
    @Body() body: RerankFlairDto,
  ): Promise<R.RerankRsp> {
    const { boxId, flairIds } = body satisfies R.RerankRqs;
    const flairBox = await this.flairBoxService.get(boxId);
    await checkManager(user.id, flairBox.board_id, { manage_exposure: true });

    const reranked = await this.service.rerank(boxId, flairIds);
    return reranked;
  }


  @UseGuards(UserGuard)
  @Patch("/:id")
  async update(
    @User() user: UserT,
    @Param("id", ParseIntPipe ) id: idT,
    @Body() body: UpdateFlairDto,
  ): Promise<R.UpdateRsp> {
    const { form } = body satisfies R.UpdateRqs;

    const flair = await this.service.get(id);
    const flairBox = await this.flairBoxService.get(flair.box_id);
    await checkManager(user.id, flairBox.board_id, { manage_exposure: true });

    const updated = await this.service.update(id, form);
    return updated;
  }

  @UseGuards(UserGuard)
  @Delete("/:id")
  async delete(
    @User() user: UserT,
    @Param("id", ParseIntPipe ) id: idT,
  ): Promise<R.DeleteRsp> {

    const flair = await this.service.get(id);
    const flairBox = await this.flairBoxService.get(flair.box_id);
    await checkManager(user.id, flairBox.board_id, { manage_exposure: true });

    const deleted = await this.service.delete(id);
    return deleted;
  }


}