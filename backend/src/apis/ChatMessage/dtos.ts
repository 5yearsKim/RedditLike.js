import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";
import { listChatMessageOptionSchema } from "@/models/ChatMessage/schema";
import { } from "@/types";

// list
export class ListChatMessageDto extends createZodDto(listChatMessageOptionSchema) {}
