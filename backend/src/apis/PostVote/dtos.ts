import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";

// score
const scorePostVoteRqs = z.object({ postId: z.number().int(), score: z.number().int() });
export class ScorePostVoteDto extends createZodDto(scorePostVoteRqs) {}