import { chatRoomM, ChatRoomSqls } from "@/models/ChatRoom";
import type { GetChatRoomOptionT } from "@/types/ChatRoom";


export function lookupBuilder(select: any[], opt: GetChatRoomOptionT): void {
  const sqls = new ChatRoomSqls(chatRoomM.table);

  // board
  if (opt.$board) {
    select.push(sqls.board());
  }

  // participants
  if (opt.$participants) {
    select.push(sqls.participants());
  }

  // last_message
  if (opt.$last_message) {
    select.push(sqls.lastMessage());
  }

  // opponent
  if (opt.$opponent && opt.userId) {
    select.push(sqls.opponent(opt.userId));
  }

  // unread_cnt
  if (opt.$unread_cnt && opt.userId) {
    select.push(sqls.unreadCount(opt.userId));
  }
}