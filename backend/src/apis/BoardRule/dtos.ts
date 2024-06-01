import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";
import { boardRuleFormSchema, listBoardRuleOptionSchema } from "@/models/BoardRule";


// create
const createBoardRuleRqs = z.object({ form: boardRuleFormSchema });
export class CreateBoardRuleDto extends createZodDto(createBoardRuleRqs) {}

// update
const updateBoardRuleRqs = z.object({ form: boardRuleFormSchema.partial() });
export class UpdateBoardRuleDto extends createZodDto(updateBoardRuleRqs) {}

// delete
// no dto

// list
const listBoardRuleRsp = listBoardRuleOptionSchema;
export class ListBoardRuleDto extends createZodDto(listBoardRuleRsp) {}

// rerank
const rerankBoardRuleRqs = z.object({ boardId: z.number().int(), ruleIds: z.array(z.number().int()) });
export class RerankBoardRuleDto extends createZodDto(rerankBoardRuleRqs) {}