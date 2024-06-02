import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";
import { boardUserBlockFormSchema, listBoardUserBlockOptionSchema } from "@/models/BoardUserBlock";


// create
export class CreateBoardUserBlockDto extends createZodDto(z.object({
  form: boardUserBlockFormSchema,
})) {}

// list
export class ListBoardUserBlockDto extends createZodDto(listBoardUserBlockOptionSchema) {}

// delete
// no dto
