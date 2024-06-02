import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";

// score
export class ScorePostVoteDto extends createZodDto(z.object({
  postId: z.number().int(),
  score: z.number().int(),
})) {}