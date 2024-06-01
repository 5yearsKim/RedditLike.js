import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";
import { flairFormSchema } from "@/models/Flair";

// create
const createFlairRqs = z.object({ form: flairFormSchema });
export class CreateFlairDto extends createZodDto(createFlairRqs) {}

// update
const updateFlairRqs = z.object({ form: flairFormSchema.partial() });
export class UpdateFlairDto extends createZodDto(updateFlairRqs) {}

// delete
// no dto


// rerank
const rerankFlairRqs = z.object({ boxId: z.number().int(), flairIds: z.array(z.number().int()) });
export class RerankFlairDto extends createZodDto(rerankFlairRqs) {}

// create custom
const createCustomFlairRqs = z.object({ form: flairFormSchema });
export class CreateCustomFlairDto extends createZodDto(createCustomFlairRqs) {}

// delete custom
// no dto