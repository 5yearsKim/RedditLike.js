import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";


// google-login
export class GoogleLoginDto extends createZodDto(z.object({
  googleAccessToken: z.string()
})) {}


// email-login
export class EmailLoginDto extends createZodDto(z.object({
  email: z.string().email(),
  code: z.string().min(1)
})) {}

// temporary login
export class TemporaryLoginDto extends createZodDto(z.object({
  id: z.string(),
})) {}


// fake-login
export class FakeLoginDto extends createZodDto(z.object({
  email: z.string().email()
})) {}

