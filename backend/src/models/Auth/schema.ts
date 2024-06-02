import { z } from "zod";
import { userSchema } from "@/models/User";
import { TG } from "@/utils/type_generator";

// // general types
// export const accountSessionSchema = z.object({
//   account: accountSchema,
//   accessToken: z.string(),
//   accessTokenExpAt: z.number(),
// });

const tgKey = "Auth";


export const userSessionSchema = z.object({
  user: userSchema,
  token: z.string(),
  tokenExpAt: z.number(),
});

TG.add(tgKey, "UserSessionT", userSessionSchema );
