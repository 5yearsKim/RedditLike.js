import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";
import { postPinFormSchema } from "@/models/PostPin";


// create
const CreatePostPinRqs = z.object({ form: postPinFormSchema });
export class CreatePostPinDto extends createZodDto(CreatePostPinRqs) {}

// delete
const DeletePostPinRqs = z.object({ boardId: z.number().int(), postId: z.number().int() });
export class DeletePostPinDto extends createZodDto(DeletePostPinRqs) {}