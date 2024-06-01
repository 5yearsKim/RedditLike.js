import { z } from "zod";
import { baseModelSchema, insertFormSchema, getOptionSchema } from "../$commons/schema";
import { TG } from "@/utils/type_generator";


const chatMessageFormZ = {
  room_id: z.number().int(),
  sender_id: z.number().int(),
  body: z.string(),
};

export const chatMessageFormSchema = insertFormSchema.extend(chatMessageFormZ);
export const chatMessageSchema = baseModelSchema.extend(chatMessageFormZ);

export const getChatMessageOptionSchema = getOptionSchema.extend({
  $sender: z.coerce.boolean()
}).partial();
export const listChatMessageOptionSchema = getChatMessageOptionSchema.extend({
  limit: z.coerce.number().int().positive(),
  cursor: z.string(),
  roomId: z.coerce.number().int(),
}).partial();


const tgKey = "ChatMessage";

TG.add(tgKey, "ChatMessageFormT", chatMessageFormSchema);
TG.add(tgKey, "_ChatMessageT", chatMessageSchema, { private: true });

TG.add(tgKey, "GetChatMessageOptionT", getChatMessageOptionSchema);
TG.add(tgKey, "ListChatMessageOptionT", listChatMessageOptionSchema);

