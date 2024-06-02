import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";
import { categoryFormSchema, getCategoryOptionSchema, listCategoryOptionSchema } from "@/models/Category";


// get
export class GetCategoryDto extends createZodDto(getCategoryOptionSchema) {}

// create
export class CreateCategoryDto extends createZodDto( z.object({
  form: categoryFormSchema,
})) {}

// update
export class UpdateCategoryDto extends createZodDto(z.object({
  form: categoryFormSchema.partial(),
})) {}

// delete
// no dto

// list
export class ListCategoryDto extends createZodDto(listCategoryOptionSchema) {}

// rerank
export class RerankCategoryDto extends createZodDto(z.object({
  categoryIds: z.number().int().array(),
})) {}