import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";
import { } from "@/models/XBoardUserFlair";

// create

export class LinkMeDto extends createZodDto(z.object({
  boardId: z.number().int(),
  flairIds: z.array(z.number().int()),
})) {}