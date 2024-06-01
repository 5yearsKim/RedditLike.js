import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";
import { chatRoomFormSchema, getChatRoomOptionSchema, listChatRoomOptionSchema } from "@/models/ChatRoom";


// get
const getChatRoomRqs = getChatRoomOptionSchema;
export class GetChatRoomDto extends createZodDto(getChatRoomRqs) {}

// create
const createChatRoomRqs = z.object({ form: chatRoomFormSchema });
export class CreateChatRoomDto extends createZodDto(createChatRoomRqs) {}

// list
const listChatRoomRqs = listChatRoomOptionSchema;
export class ListChatRoomDto extends createZodDto(listChatRoomRqs) {}

// init
const initChatRoomRqs = z.object({ boardId: z.number().int(), opponentId: z.number().int() });
export class InitChatRoomDto extends createZodDto(initChatRoomRqs) {}

// init-board
const initBoardChatRoomRqs = z.object({ boardId: z.number().int() });
export class InitBoardChatRoomDto extends createZodDto(initBoardChatRoomRqs) {}