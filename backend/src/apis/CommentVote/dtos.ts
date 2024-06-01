import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";


// score
const scoreCommentVoteRqs = z.object({ commentId: z.number().int(), score: z.number().int() });
export class ScoreCommentVoteDto extends createZodDto(scoreCommentVoteRqs) {}
