import { CommentT } from "@/types";

export function countChildren(comment: CommentT): number {
  if (!comment.children) {
    return 0;
  }
  let sum = 0;
  for (const child of comment.children) {
    sum += child.num_children ?? 0;
  }
  return sum;
}
