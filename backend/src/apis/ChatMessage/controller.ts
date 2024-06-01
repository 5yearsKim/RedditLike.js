import {
  Controller, Post, Get,
  Body, Param, Query,
} from "@nestjs/common";
import type * as R from "@/types/ChatMessage.api";
import {
  ListChatMessageDto
} from "./dtos";
import { ChatMessageService } from "./service";


@Controller("chat-messages")
export class ChatMessageController {
  constructor(private readonly service: ChatMessageService) {}

  @Get("/")
  async list(
    @Query() query: ListChatMessageDto,
  ): Promise<R.ListRsp> {
    const listOpt = query satisfies R.ListRqs;
    const { data, nextCursor } = await this.service.list(listOpt);
    return { data, nextCursor };
  }

}