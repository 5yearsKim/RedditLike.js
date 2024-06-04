import { z } from "zod";
import { createZodDto } from "nestjs-zod";
import {
  boardFormSchema,
  getBoardOptionSchema, listBoardOptionSchema,
} from "@/models/Board";


// create
export class CreateBoardDto extends createZodDto(z.object({
  form: boardFormSchema
})) {}

// get
export class GetBoardDto extends createZodDto(getBoardOptionSchema) {}


// update
export class UpdateBoardDto extends createZodDto(z.object({
  form: boardFormSchema.partial(),
})) {}

// list
export class ListBoardDto extends createZodDto(listBoardOptionSchema) {}

// getAvatarPresigendUrl
export class GetAvatarPresignedUrlDto extends createZodDto(z.object({
  boardId: z.number().int(),
  mimeType: z.string(),
})) {}

// getBgCoverPresigendUrl
export class GetBgCoverPresignedUrlDto extends createZodDto(z.object({
  boardId: z.number().int(),
  mimeType: z.string(),
})) {}


// getDefaultAvatarPresigendUrl
export class GetDefaultAvatarPresignedUrlDto extends createZodDto(z.object({
  boardId: z.number().int(),
  mimeType: z.string(),
})) {}