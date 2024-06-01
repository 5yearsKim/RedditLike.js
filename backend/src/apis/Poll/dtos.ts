import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";
import { pollFormSchema, getPollOptionSchema } from "@/models/Poll";
import { pollCandFormSchema } from "@/models/PollCand";
import { } from "@/types/Poll";


// create
export class CreatePollDto extends createZodDto(z.object({
  form: pollFormSchema,
  relations: z.object({
    cands: z.array(pollCandFormSchema).optional(),
  }).optional(),
})) {}

// update
export class UpdatePollDto extends createZodDto(z.object({
  form: pollFormSchema.partial(),
  relations: z.object({
    cands: z.array(pollCandFormSchema).optional(),
  }).optional(),
})) {}

// get
export class GetPollDto extends createZodDto(getPollOptionSchema) {}