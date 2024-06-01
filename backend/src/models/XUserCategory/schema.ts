import { z } from "zod";
import { baseModelSchema, insertFormSchema } from "../$commons/schema";
import { TG } from "@/utils/type_generator";


const XUserCategoryFormZ = {
  category_id: z.number(),
  user_id: z.number(),
};

export const xUserCategoryFormSchema = insertFormSchema.extend(XUserCategoryFormZ);
export const xUserCategorySchema = baseModelSchema.extend(XUserCategoryFormZ);


const tgKey = "XUserCategory";

TG.add(tgKey, "XUserCategoryFormT", xUserCategoryFormSchema);
TG.add(tgKey, "XUserCategoryT", xUserCategorySchema);


