import { z } from "zod";
import { accountSchema } from "@/models/Account";
import { TG } from "@/utils/type_generator";

// general types
export const accountSessionSchema = z.object({
  account: accountSchema,
  accessToken: z.string(),
  accessTokenExpAt: z.number(),
});

const tgKey = "Auth";

TG.add(tgKey, "AccountSessionT", accountSessionSchema );

