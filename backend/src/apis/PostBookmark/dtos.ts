import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";
import { postBookmarkFormSchema } from "@/models/PostBookmark";


// create
const CreatePostBookmarkRqs = z.object({ form: postBookmarkFormSchema });
export class CreatePostBookmarkDto extends createZodDto(CreatePostBookmarkRqs) {}

// delete
// no dto
