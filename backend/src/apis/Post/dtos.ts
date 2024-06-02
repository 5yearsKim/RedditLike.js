import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";
import { postFormSchema, getPostOptionSchema, listPostOptionSchema } from "@/models/Post";
import { flagSchema } from "@/models/Flag";
import { imageSchema } from "@/models/Image";
import { videoSchema } from "@/models/Video";


// create
export class CreatePostDto extends createZodDto(z.object({
  form: postFormSchema,
  relations: z.object({
    flags: flagSchema.array().optional(),
    images: imageSchema.array().optional(),
    videos: videoSchema.array().optional(),
  }).optional()
})) {}

// get
export class GetPostDto extends createZodDto(getPostOptionSchema) {}

// getWithGroupCheck
// same as get

// update
export class UpdatePostDto extends createZodDto(z.object({
  form: postFormSchema.partial(),
  relations: z.object({
    flags: flagSchema.array().optional(),
    images: imageSchema.array().optional(),
    videos: videoSchema.array().optional(),
  }).optional(),
})) {}

// list
export class ListPostDto extends createZodDto(listPostOptionSchema) {}

// delete

// trash
export class TrashPostDto extends createZodDto(z.object({ reason: z.string() })) {}

// getImagePresigendUrl
export class GetImagePresignedUrlDto extends createZodDto(z.object({ mimeType: z.string() })) {}


// getVideoPresigendUrl
export class GetVideoPresignedUrlDto extends createZodDto(z.object({ mimeType: z.string() })) {}
