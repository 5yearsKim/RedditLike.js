import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";
import { } from "@/models/XBoardCategory";

// link
const linkRqs = z.object({ boardId: z.number().int(), categoryIds: z.array(z.number().int()) });
export class LinkDto extends createZodDto(linkRqs) {}

