import ShortUniqueId from "short-unique-id";

export function genUniqueId({ len }: {len: number}) {
  const { randomUUID: randomUserSub } = new ShortUniqueId({ length: len });
  return randomUserSub();
}