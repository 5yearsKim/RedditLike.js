import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";
// import {  } from "@/types/UrlInfo";


// inspect
export class InspectUrlDto extends createZodDto( z.object({
  url: z.string(),
})) {}

