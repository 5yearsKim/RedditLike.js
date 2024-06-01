import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";
import { boardManagerFormSchema, listBoardManageOptionSchema, getBoardManagerOptionSchema } from "@/models/BoardManager";


// create
const createBoardManagerRqs = z.object({ form: boardManagerFormSchema });
export class CreateBoardManagerDto extends createZodDto(createBoardManagerRqs) {}

// delete
// no dto

// get
const getBoardManagerRqs = getBoardManagerOptionSchema;
export class GetBoardManagerDto extends createZodDto(getBoardManagerRqs) {}

// update
const updateBoardManagerRqs = z.object({ form: boardManagerFormSchema.partial() });
export class UpdateBoardManagerDto extends createZodDto(updateBoardManagerRqs) {}

// list
const listBoardManagerRqs = listBoardManageOptionSchema;
export class ListBoardManagerDto extends createZodDto(listBoardManagerRqs) {}

