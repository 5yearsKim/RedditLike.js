import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";
import { commentReportFormSchema, listCommentReportOptionSchema } from "@/models/CommentReport";

// create
export class CreateCommentReportDto extends createZodDto(z.object({ form: commentReportFormSchema })) {}

// list
export class ListCommentReportDto extends createZodDto(listCommentReportOptionSchema) {}