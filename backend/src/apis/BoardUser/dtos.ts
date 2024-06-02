import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";
import { boardUserFormSchema, listBoardUserOptionSchema } from "@/models/BoardUser";

// create
export class CreateBoardUserDto extends createZodDto(z.object({
  form: boardUserFormSchema,
})) {}

// list
export class ListBoardUserDto extends createZodDto(listBoardUserOptionSchema) {}

// getAvatarPresigendUrl
export class GetAvatarPresignedUrlDto extends createZodDto(z.object({
  boardId: z.number().int(),
  mimeType: z.string(),
})) {}