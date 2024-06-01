import {
  Controller, Post,
  Body,
  UseGuards,
} from "@nestjs/common";
import { User } from "@/apis/$decorators";
import { UserGuard } from "@/apis/$guards";
import {
  LinkMeDto,
} from "./dtos";
import { XBoardUserFlairService } from "./service";
import { BoardUserService } from "../BoardUser/service";
import type * as R from "@/types/XBoardUserFlair.api";
import type { UserT } from "@/types";

@Controller("x-board-user-flair")
export class XBoardUserFlairController {
  constructor(
    private readonly service: XBoardUserFlairService,
    private readonly boardUserService: BoardUserService,
  ) {}

  @UseGuards(UserGuard)
  @Post("/link-me")
  async linkMe(
    @User() user: UserT,
    @Body() body: LinkMeDto,
  ): Promise<R.LinkMeRsp> {

    const { boardId, flairIds } = body as R.LinkMeRqs;
    const boardUser = await this.boardUserService.getOrCreateUser(user.id, boardId);
    const created = await this.service.linkMe(boardUser.id, flairIds);

    return created;
  }

}