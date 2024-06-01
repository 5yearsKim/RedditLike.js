import { z } from "zod";
import { baseModelSchema, insertFormSchema, getOptionSchema } from "../$commons/schema";
import { TG } from "@/utils/type_generator";


const chatUserFormZ = {
  room_id: z.number().int(),
  user_id: z.number().int(),
  last_checked_at: z.date().nullish(),
  deleted_at: z.date().nullish(),
};

export const chatUserFormSchema = insertFormSchema.extend(chatUserFormZ);
export const chatUserSchema = baseModelSchema.extend(chatUserFormZ);

export const getChatUserOptionSchema = getOptionSchema.extend({
  $author: z.coerce.boolean(),
}).partial();
export const listChatUserOptionSchema = getChatUserOptionSchema.extend({});


const tgKey = "ChatUser";

TG.add(tgKey, "ChatUserFormT", chatUserFormSchema);
TG.add(tgKey, "_ChatUserT", chatUserSchema, { private: true });

TG.add(tgKey, "GetChatUserOptionT", getChatUserOptionSchema);
TG.add(tgKey, "ListChatUserOptionT", listChatUserOptionSchema);
