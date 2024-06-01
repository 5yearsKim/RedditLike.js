import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";
import { boardUserFormSchema, listBoardUserOptionSchema } from "@/models/BoardUser";

// create
const createBoardUserRqs = z.object({ form: boardUserFormSchema });
export class CreateBoardUserDto extends createZodDto(createBoardUserRqs) {}

// list
const listBoardUserRqs = listBoardUserOptionSchema;
export class ListBoardUserDto extends createZodDto(listBoardUserRqs) {}

// getAvatarPresigendUrl
const getAvatarPresignedUrlRqs = z.object({ boardId: z.number().int(), mimeType: z.string() });
export class GetAvatarPresignedUrlDto extends createZodDto(getAvatarPresignedUrlRqs) {}