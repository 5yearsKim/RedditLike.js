import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";
import { postPinFormSchema } from "@/models/PostPin";


// create
export class CreatePostPinDto extends createZodDto(z.object({
  form: postPinFormSchema,
})) {}

// delete
export class DeletePostPinDto extends createZodDto( z.object({
  boardId: z.number().int(),
  postId: z.number().int(),
})) {}