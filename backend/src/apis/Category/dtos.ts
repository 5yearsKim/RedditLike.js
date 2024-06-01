import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";
import { categoryFormSchema, getCategoryOptionSchema, listCategoryOptionSchema } from "@/models/Category";


// get
const getCategoryRqs = getCategoryOptionSchema;
export class GetCategoryDto extends createZodDto(getCategoryRqs) {}

// create
const createCategoryRqs = z.object({ form: categoryFormSchema });
export class CreateCategoryDto extends createZodDto(createCategoryRqs) {}

// update
const updateCategoryRqs = z.object({ form: categoryFormSchema.partial() });
export class UpdateCategoryDto extends createZodDto(updateCategoryRqs) {}

// delete
// no dto

// list
const listCategoryRqs = listCategoryOptionSchema;
export class ListCategoryDto extends createZodDto(listCategoryRqs) {}

// rerank
const rerankCategoryRqs = z.object({ groupId: z.number().int(), categoryIds: z.number().int().array() });
export class RerankCategoryDto extends createZodDto(rerankCategoryRqs) {}