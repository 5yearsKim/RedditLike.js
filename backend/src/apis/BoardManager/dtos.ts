import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";
import { boardManagerFormSchema, listBoardManageOptionSchema, getBoardManagerOptionSchema } from "@/models/BoardManager";


// create
export class CreateBoardManagerDto extends createZodDto(z.object({
  form: boardManagerFormSchema,
})) {}

// delete
// no dto

// get
export class GetBoardManagerDto extends createZodDto(getBoardManagerOptionSchema) {}

// update
export class UpdateBoardManagerDto extends createZodDto( z.object({
  form: boardManagerFormSchema.partial(),
})) {}

// list
export class ListBoardManagerDto extends createZodDto(listBoardManageOptionSchema) {}

