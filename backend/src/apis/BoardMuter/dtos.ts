import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";
import { boardMuterFormSchema, getBoardMuterOptionSchema, listBoardMuterOptionSchema } from "@/models/BoardMuter";


// create
const createBoardMuterRqs = z.object({ form: boardMuterFormSchema });
export class CreateBoardMuterDto extends createZodDto(createBoardMuterRqs) {}

// delete
// no dto

// list
const listBoardMuterRqs = listBoardMuterOptionSchema;
export class ListBoardMuterDto extends createZodDto(listBoardMuterRqs) {}

// get
const getBoardMuterRqs = getBoardMuterOptionSchema;
export class GetBoardMuterDto extends createZodDto(getBoardMuterRqs) {}

// update
const updateBoardMuterRqs = z.object({ form: boardMuterFormSchema.partial() });
export class UpdateBoardMuterDto extends createZodDto(updateBoardMuterRqs) {}

