import { z } from "zod";
import { baseModelSchema, insertFormSchema } from "../$commons/schema";
import { TG } from "@/utils/type_generator";


const accountFormZ = {
  sub: z.string().min(1).max(64).describe("provided by firebase"),
  email: z.string().email(),
  deleted_at: z.coerce.date().nullish(),
};

export const accountFormSchema = insertFormSchema.extend(accountFormZ);

export const accountSchema = baseModelSchema.extend(accountFormZ);

export const getAccountOptionSchema = z.object({});
export const listAccountOptionSchema = getAccountOptionSchema.extend({});

const tgKey = "Account";

TG.add(tgKey, "AccountFormT", accountFormSchema);
TG.add(tgKey, "_AccountT", accountSchema, { private: true });


TG.add(tgKey, "GetAccountOptionT", getAccountOptionSchema);
TG.add(tgKey, "ListAccountOptionT", listAccountOptionSchema);

