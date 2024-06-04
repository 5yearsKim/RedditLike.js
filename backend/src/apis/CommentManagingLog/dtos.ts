import { createZodDto } from "nestjs-zod";
import { listCommentManagingLogOptionSchema } from "@/models/CommentManagingLog";


// list
export class ListCommentManagingLogDto extends createZodDto(listCommentManagingLogOptionSchema) {}