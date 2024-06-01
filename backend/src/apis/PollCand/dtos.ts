import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";
import { listPollCandOptionSchema } from "@/models/PollCand";
// import { } from "@/types/_";


// list
export class ListPollCandDto extends createZodDto(listPollCandOptionSchema) {}

// getThumbnailPresignedUrl
export class GetThumbnailPresignedUrlDto extends createZodDto(z.object({
  mimeType: z.string(),
})) {}