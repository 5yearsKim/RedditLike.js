import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";


// request
export class RequestEmailVerificationDto extends createZodDto(z.object({
  email: z.string().email(),
  emailOpt: z.object({
    serviceName: z.string().optional(),
    locale: z.string().optional()
  }).optional(),
})) {}

// verify
export class VerifyEmailVerificationDto extends createZodDto(z.object({
  email: z.string().email(),
  code: z.string().min(1)
})) {}

