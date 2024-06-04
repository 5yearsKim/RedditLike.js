import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";
import { } from "@/models/XBoardCategory";

// link
export class LinkDto extends createZodDto(z.object({
  boardId: z.number().int(),
  categoryIds: z.array(z.number().int()),
})) {}

