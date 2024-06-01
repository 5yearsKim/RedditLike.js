import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";
// import { } from "@/types/_";


// vote
export class VotePollDto extends createZodDto(z.object({
  pollId: z.number().int(),
  candIds: z.array(z.number().int()),
})) {}
