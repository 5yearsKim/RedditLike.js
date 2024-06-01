import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";
import { flagFormSchema, listFlagOptionSchema } from "@/models/Flag";

// create
const createFlagRqs = z.object({ form: flagFormSchema });
export class CreateFlagDto extends createZodDto(createFlagRqs) {}

// list
const listFlagRqs = listFlagOptionSchema;
export class ListFlagDto extends createZodDto(listFlagRqs) {}

// update
const updateFlagRqs = z.object({ form: flagFormSchema.partial() });
export class UpdateFlagDto extends createZodDto(updateFlagRqs) {}

// delete
// dto not needed