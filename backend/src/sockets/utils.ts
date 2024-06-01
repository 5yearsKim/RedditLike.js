// socket utils
export function toRoomId(val: any, type: "user"|"chatRoom"|"board"): string {
  if (type == "user") {
    return `user-${val}`;
  }
  if (type == "chatRoom") {
    return `chatRoom-${val}`;
  }
  if (type == "board") {
    return `board-${val}`;
  }
  return val.toString();
}