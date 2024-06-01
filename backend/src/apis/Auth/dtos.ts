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


// fake-login
export class FakeLoginDto extends createZodDto(z.object({
  email: z.string().email()
})) {}


// // refresh
// const refreshRsp = accountSessionSchema;
// export type RefreshRsp = z.infer<typeof refreshRsp>

// verify-account-token
export class VerifyAccountTokenDto extends createZodDto(z.object({
  accountToken: z.string()
})) {}

