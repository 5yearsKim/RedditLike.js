import {
  Controller, Post, Get,
  Body, Param, Query,
  ParseIntPipe,
  UseGuards,
} from "@nestjs/common";
import { User } from "@/apis/$decorators";
import { BoardUserService } from "./service";
import {
  CreateBoardUserDto,
  ListBoardUserDto,
  GetAvatarPresignedUrlDto
} from "./dtos";
import * as err from "@/errors";
import type * as R from "@/types/BoardUser.api";
import { UserGuard } from "../$guards";
import type { UserT } from "@/types";


@Controller("board-users")
export class BoardUserController {
  constructor(private readonly service: BoardUserService) {}

  @UseGuards(UserGuard)
  @Post("/")
  async create(
    @User() user: UserT,
    @Body() body: CreateBoardUserDto,
  ): Promise<R.CreateRsp> {

    const { form } = body as R.CreateRqs;
    if (form.user_id !== user.id) {
      throw new err.ForbiddenE("Invalid user");
    }
    const created = await this.service.create(form);

    return created;
  }


  @Get("/boards/:boardId/author")
  async getAuthor(
    @User() user: UserT|null,
    @Param("boardId", ParseIntPipe) boardId: idT,
  ): Promise<R.GetAuthorRsp> {
    if (!user) {
      return { data: null };
    }
    const author = await this.service.getAuthor(user.id, boardId);
    return { data: author };
  }

  @Get("/boards/:boardId/nickname-unique/:nickname")
  async checkNicknameUnique(
    @Param("boardId", ParseIntPipe) boardId: idT,
    @Param("nickname") nickname: string,
  ): Promise<R.CheckNicknameUniqueRsp> {
    const isUnique = await this.service.checkNicknameUnique(boardId, nickname);
    return { data: isUnique };
  }

  @Get("/")
  async list(
    @Query() query: ListBoardUserDto,
  ): Promise<R.ListBoardUserRsp> {
    const listOpt = query satisfies R.ListBoardUserRqs;
    const { data, nextCursor } = await this.service.list(listOpt);
    return { data, nextCursor };
  }

  @UseGuards(UserGuard)
  @Post("/avatar/presigned-url")
  async getAvatarPresignedUrl(
    @User() user: UserT,
    @Body() body: GetAvatarPresignedUrlDto,
  ): Promise<R.GetAvatarPresignedUrlRsp> {
    const { mimeType, boardId } = body satisfies R.GetAvatarPresignedUrlRqs;
    const { putUrl, key } = await this.service.getAvatarPresingedUrl(user.id, boardId, mimeType);
    return { putUrl, key };
  }
}