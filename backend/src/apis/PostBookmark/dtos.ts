import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";
import { postBookmarkFormSchema } from "@/models/PostBookmark";


// create
export class CreatePostBookmarkDto extends createZodDto(z.object({
  form: postBookmarkFormSchema,
})) {}

// delete
// no dto
