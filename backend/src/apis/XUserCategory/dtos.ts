import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";

// create
export class CreateDto extends createZodDto(z.object({ categoryId: z.number().int() })) {}

// delete
export class DeleteDto extends createZodDto( z.object({ categoryId: z.number().int() })) {}

