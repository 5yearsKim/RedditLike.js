import { z } from "zod";
import { baseModelSchema, insertFormSchema, getOptionSchema } from "../$commons/schema";
import { TG } from "@/utils/type_generator";


export const categoryFormSchema = insertFormSchema.extend({
  label: z.string().min(1).max(32),
  parent_id: z.number().int().nullish(),
  rank: z.number().int().nullish(),
});
export const categorySchema = baseModelSchema.extend(categoryFormSchema.shape);

export const getCategoryOptionSchema = getOptionSchema.extend({
  $my_like: z.coerce.boolean(),
}).partial();
export const listCategoryOptionSchema = getCategoryOptionSchema.extend({
  boardId: z.coerce.number().int(),
}).partial();


const tgKey = "Category";

TG.add(tgKey, "CategoryFormT", categoryFormSchema);
TG.add(tgKey, "_CategoryT", categorySchema, { private: true });

TG.add(tgKey, "GetCategoryOptionT", getCategoryOptionSchema);
TG.add(tgKey, "ListCategoryOptionT", listCategoryOptionSchema);

