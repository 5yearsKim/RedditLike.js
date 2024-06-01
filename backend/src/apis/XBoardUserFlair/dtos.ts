import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";
import { } from "@/models/XBoardUserFlair";

// create

const linkMeRqs = z.object({
  boardId: z.number().int(),
  flairIds: z.array(z.number().int()),
});
export class LinkMeDto extends createZodDto(linkMeRqs) {}