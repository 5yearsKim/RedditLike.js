import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";
import { commentReportFormSchema, listCommentReportOptionSchema } from "@/models/CommentReport";

// create
const createCommentReportRqs = z.object({ form: commentReportFormSchema });
export class CreateCommentReportDto extends createZodDto(createCommentReportRqs) {}

// list
const listCommentReportRqs = listCommentReportOptionSchema;
export class ListCommentReportDto extends createZodDto(listCommentReportRqs) {}