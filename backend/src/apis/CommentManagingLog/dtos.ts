import { createZodDto } from "nestjs-zod";
import { listCommentManagingLogOptionSchema } from "@/models/CommentManagingLog";


// list
const listCommentManagingLogRqs = listCommentManagingLogOptionSchema;
export class ListCommentManagingLogDto extends createZodDto(listCommentManagingLogRqs) {}