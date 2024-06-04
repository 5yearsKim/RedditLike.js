import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";
// import { PostCheckFormT, PostCheckT } from "@/types/PostCheck";


// check
export class CheckDto extends createZodDto(z.object({
  postId: z.number().int(),
  type: z.enum(["user", "ip", "dummy"]),
})) {}