import type { AuthorT } from "@/types/BoardUser";

export function extractNameFromAuthor(author: AuthorT, defaultNickname: string): string {
  return author.nickname ?? author.default_nickname ?? defaultNickname;
}
