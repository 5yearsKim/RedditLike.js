import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";

// create
const createRqs = z.object({ categoryId: z.number().int() });
export class CreateDto extends createZodDto(createRqs) {}

// delete
const deleteRqs = z.object({ categoryId: z.number().int() });
export class DeleteDto extends createZodDto(deleteRqs) {}

