import { z } from "zod";
import { baseModelSchema, insertFormSchema, getOptionSchema } from "../$commons/schema";
import { TG } from "@/utils/type_generator";


const chatRoomFormZ = {
  board_id: z.number().int(),
  is_public: z.boolean(),
  last_message_at: z.date().nullish(),
};

export const chatRoomFormSchema = insertFormSchema.extend(chatRoomFormZ);

export const chatRoomSchema = baseModelSchema.extend({
  ...chatRoomFormZ,
});

export const getChatRoomOptionSchema = getOptionSchema.extend({
  $board: z.coerce.boolean(),
  $participants: z.coerce.boolean(),
  $last_message: z.coerce.boolean(),
  $opponent: z.coerce.boolean(),
  $unread_cnt: z.coerce.boolean()
}).partial();
export const listChatRoomOptionSchema = getChatRoomOptionSchema.extend({
  limit: z.coerce.number().int().positive(),
  cursor: z.string(),
  public: z.enum(["except", "only"]),
  lastMessage: z.enum(["except", "only"]), // fetch only chatrooms with last message
  boardId: z.coerce.number().int(),
}).partial();


const tgKey = "ChatRoom";

TG.add(tgKey, "ChatRoomFormT", chatRoomFormSchema);
TG.add(tgKey, "_ChatRoomT", chatRoomSchema, { private: true });

TG.add(tgKey, "GetChatRoomOptionT", getChatRoomOptionSchema);
TG.add(tgKey, "ListChatRoomOptionT", listChatRoomOptionSchema);
