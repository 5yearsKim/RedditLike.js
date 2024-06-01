import { z } from "zod";
import { baseModelSchema, insertFormSchema } from "../$commons/schema";
import { TG } from "@/utils/type_generator";

const emailVerificationFormZ = {
  email: z.string().min(1),
  is_verified: z.boolean(),
  code: z.string().min(1),
  trial: z.number(),
};


export const emailVerificationFormSchema = insertFormSchema.extend(emailVerificationFormZ);
export const emailVerificationSchema = baseModelSchema.extend(emailVerificationFormZ);

const tgKey = "EmailVerification";

TG.add(tgKey, "EmailVerificationFormT", emailVerificationFormSchema);
TG.add(tgKey, "EmailVerificationT", emailVerificationSchema);
