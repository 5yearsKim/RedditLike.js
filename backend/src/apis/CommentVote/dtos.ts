import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";


// score
export class ScoreCommentVoteDto extends createZodDto( z.object({
  commentId: z.number().int(),
  score: z.number().int(),
})) {}
