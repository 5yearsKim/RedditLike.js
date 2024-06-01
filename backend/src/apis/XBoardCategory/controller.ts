import {
  Controller, Post,
  Body,
} from "@nestjs/common";
import { XBoardCategoryService } from "./service";
import {
  LinkDto,
} from "./dtos";
import type * as R from "@/types/XBoardCategory.api";


@Controller("x-board-category")
export class XBoardCategoryController {
  constructor(private readonly service: XBoardCategoryService) {}

  @Post("/link")
  async link(
    @Body() body: LinkDto,
  ): Promise<R.LinkRsp> {

    const { boardId, categoryIds } = body satisfies R.LinkRqs;
    const created = await this.service.link(boardId, categoryIds);
    return created;
  }

}