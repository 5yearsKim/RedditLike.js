import {
  Controller, Post, Get, Patch,
  Body, Param, Query,
  UseGuards, ParseIntPipe,
} from "@nestjs/common";
import { User } from "@/apis/$decorators";
import {
  GetChatRoomDto,
  CreateChatRoomDto,
  InitChatRoomDto,
  InitBoardChatRoomDto,
  ListChatRoomDto,
} from "./dtos";
import { ChatRoomService } from "./service";
import type * as R from "@/types/ChatRoom.api";
import { UserGuard, checkManager } from "../$guards";
import { UserT } from "@/types";


@Controller("chat-rooms")
export class ChatRoomController {
  constructor(private readonly service: ChatRoomService) {}

  @UseGuards(UserGuard)
  @Post("/")
  async create(
    @Body() body: CreateChatRoomDto,
  ): Promise<R.CreateRsp> {

    const { form } = body satisfies R.CreateRqs;
    const created = await this.service.create(form);

    return created;
  }

  @UseGuards(UserGuard)
  @Post("/init-board")
  async initBoardChat(
    @User() user: UserT,
    @Body() body: InitBoardChatRoomDto,
  ): Promise<R.InitBoardRsp> {

    const { boardId } = body satisfies R.InitBoardRqs;
    await checkManager(user.id, boardId);
    const created = await this.service.initBoardChat(boardId);

    return created;
  }


  @UseGuards(UserGuard)
  @Post("/init")
  async initChat(
    @User() user: UserT,
    @Body() body: InitChatRoomDto,
  ): Promise<R.InitRsp> {

    const { boardId, opponentId } = body satisfies R.InitRqs;
    const participantIds = [user.id, opponentId];
    const created = await this.service.initChat(boardId, participantIds);

    return created;
  }

  @Get("/")
  async list(
    @User() user: UserT|null,
    @Query() query: ListChatRoomDto,
  ) : Promise<R.ListRsp> {
    const listOpt = query satisfies R.ListRqs;
    if (user) {
      listOpt.userId = user.id;
    }
    const { data, nextCursor } = await this.service.list(listOpt);
    return { data, nextCursor };
  }


  @Get("/:id")
  async get(
    @User() user: UserT|null,
    @Query() query: GetChatRoomDto,
    @Param("id", ParseIntPipe) id: idT,
  ): Promise<R.GetRsp> {

    const getOpt = query satisfies R.GetRqs;
    if (user) {
      getOpt.userId = user.id;
    }
    const fetched = await this.service.get(id, getOpt);

    return { data: fetched };
  }

  @UseGuards(UserGuard)
  @Patch("/:id/leave")
  async leaveChat(
    @User() user: UserT,
    @Param("id", ParseIntPipe) id: idT,
  ): Promise<R.LeaveRsp> {

    const chatRoom = await this.service.get(id);
    await this.service.leaveChat(user.id, chatRoom.id);

    return null;
  }
}