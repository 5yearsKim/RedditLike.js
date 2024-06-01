import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";
import { postReportFormSchema, listPostReportOptionSchema } from "@/models/PostReport";


// create
const createPostReportRqs = z.object({ form: postReportFormSchema });
export class CreatePostReportDto extends createZodDto(createPostReportRqs) {}

// list
const listPostReportRqs = listPostReportOptionSchema;
export class ListPostReportDto extends createZodDto(listPostReportRqs) {}

