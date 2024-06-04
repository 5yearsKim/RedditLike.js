import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";
import { boardRuleFormSchema, listBoardRuleOptionSchema } from "@/models/BoardRule";


// create
export class CreateBoardRuleDto extends createZodDto(z.object({
  form: boardRuleFormSchema,
})) {}

// update
export class UpdateBoardRuleDto extends createZodDto(z.object({
  form: boardRuleFormSchema.partial(),
})) {}

// delete
// no dto

// list
export class ListBoardRuleDto extends createZodDto(listBoardRuleOptionSchema) {}

// rerank
export class RerankBoardRuleDto extends createZodDto(z.object({
  boardId: z.number().int(),
  ruleIds: z.array(z.number().int()),
})) {}