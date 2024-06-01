import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";
// import {  } from "@/types/UrlInfo";


// inspect
const inspectUrlRqs = z.object({ url: z.string() });
export class InspectUrlDto extends createZodDto(inspectUrlRqs) {}

