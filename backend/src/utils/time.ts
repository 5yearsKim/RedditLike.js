

export function getLocaleToday(): string {
  const offset = 1000 * 60 * 60 * 9;
  const koreaNow = new Date((new Date()).getTime() + offset);
  return koreaNow.toISOString().split("T")[0];
}