import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";
import { postReportFormSchema, listPostReportOptionSchema } from "@/models/PostReport";


// create
export class CreatePostReportDto extends createZodDto( z.object({
  form: postReportFormSchema,
})) {}

// list
export class ListPostReportDto extends createZodDto(listPostReportOptionSchema) {}

