import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";

// follow
export class FollowDto extends createZodDto(z.object({
  boardId: z.number().int(),
})) {}

// unfollow
export class UnfollowDto extends createZodDto(z.object({
  boardId: z.number().int(),
})) {}