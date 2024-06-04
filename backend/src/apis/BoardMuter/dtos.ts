import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";
import { boardMuterFormSchema, getBoardMuterOptionSchema, listBoardMuterOptionSchema } from "@/models/BoardMuter";


// create
export class CreateBoardMuterDto extends createZodDto(z.object({
  form: boardMuterFormSchema,
})) {}

// delete
// no dto

// list
export class ListBoardMuterDto extends createZodDto(listBoardMuterOptionSchema) {}

// get
export class GetBoardMuterDto extends createZodDto(getBoardMuterOptionSchema) {}

// update
export class UpdateBoardMuterDto extends createZodDto(z.object({
  form: boardMuterFormSchema.partial(),
})) {}

