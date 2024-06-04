import { z } from "zod";
import { userSchema } from "@/models/User";
import { TG } from "@/utils/type_generator";


const tgKey = "Auth";


export const userSessionSchema = z.object({
  user: userSchema,
  token: z.string(),
  tokenExpAt: z.number(),
});

TG.add(tgKey, "UserSessionT", userSessionSchema );
