import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";
import { boardUserBlockFormSchema, listBoardUserBlockOptionSchema } from "@/models/BoardUserBlock";


// create
const createBoardUserBlockRqs = z.object({ form: boardUserBlockFormSchema });
export class CreateBoardUserBlockDto extends createZodDto(createBoardUserBlockRqs) {}

// list
const listBoardUserBlockRqs = listBoardUserBlockOptionSchema;
export class ListBoardUserBlockDto extends createZodDto(listBoardUserBlockRqs) {}

// delete
// no dto
