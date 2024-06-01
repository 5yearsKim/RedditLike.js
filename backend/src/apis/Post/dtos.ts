import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";
import { postFormSchema, getPostOptionSchema, listPostOptionSchema } from "@/models/Post";
import { flagSchema } from "@/models/Flag";
import { imageSchema } from "@/models/Image";
import { videoSchema } from "@/models/Video";


// create
const CreatePostRqs = z.object({
  form: postFormSchema,
  relations: z.object({
    flags: flagSchema.array().optional(),
    images: imageSchema.array().optional(),
    videos: videoSchema.array().optional(),
  }).optional(),
});
export class CreatePostDto extends createZodDto(CreatePostRqs) {}

// get
export class GetPostDto extends createZodDto(getPostOptionSchema) {}

// getWithGroupCheck
// same as get

// update
const UpdatePostRqs = z.object({
  form: postFormSchema.partial(),
  relations: z.object({
    flags: flagSchema.array().optional(),
    images: imageSchema.array().optional(),
    videos: videoSchema.array().optional(),
  }).optional(),
});
export class UpdatePostDto extends createZodDto(UpdatePostRqs) {}

// list
const ListPostRqs = listPostOptionSchema;
export class ListPostDto extends createZodDto(ListPostRqs) {}

// delete

// trash
const trashPostRqs = z.object({ reason: z.string() });
export class TrashPostDto extends createZodDto(trashPostRqs) {}

// getImagePresigendUrl
const GetImagePresignedUrlRqs = z.object({ mimeType: z.string() });
export class GetImagePresignedUrlDto extends createZodDto(GetImagePresignedUrlRqs) {}


// getVideoPresigendUrl
const GetVideoPresignedUrlRqs = z.object({ mimeType: z.string() });
export class GetVideoPresignedUrlDto extends createZodDto(GetVideoPresignedUrlRqs) {}
