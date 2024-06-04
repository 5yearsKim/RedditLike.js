import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";
import { chatRoomFormSchema, getChatRoomOptionSchema, listChatRoomOptionSchema } from "@/models/ChatRoom";


// get
export class GetChatRoomDto extends createZodDto(getChatRoomOptionSchema) {}

// create
export class CreateChatRoomDto extends createZodDto(z.object({
  form: chatRoomFormSchema,
})) {}

// list
export class ListChatRoomDto extends createZodDto(listChatRoomOptionSchema) {}

// init
export class InitChatRoomDto extends createZodDto( z.object({
  boardId: z.number().int(),
  opponentId: z.number().int(),
})) {}

// init-board
export class InitBoardChatRoomDto extends createZodDto( z.object({
  boardId: z.number().int(),
})) {}