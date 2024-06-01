import { addMilliseconds, subMilliseconds } from "date-fns";


export function edgeTimestamp(ts: Date|string, type: "ceil"|"floor") : Date {
  if (type == "ceil") {
    return addMilliseconds(new Date(ts), 10);
  }
  if (type == "floor") {
    return subMilliseconds(new Date(ts), 10);
  }
  return new Date(ts);
}

export function encodeCursor(cursor: {[key: string]: any}): string {
  const sCursor = JSON.stringify(cursor);
  return Buffer.from(sCursor, "utf8").toString("base64");
}

export function decodeCursor(cursor: string): {[key: string]: any}{
  try {
    const sCursor = Buffer.from(cursor, "base64").toString("utf8");
    return JSON.parse(sCursor);
  } catch (e) {
    return {};
  }
}

// const he = fid2uuid('pK2CyIednDeVyjPzGK1EOjdBlxw1');
// console.log(he);
type ExtractTextOptionT = {
  ellipsis?: boolean
  maxLen?: number,
}

export function extractText(content: string, type:"md"|"html"|"text", option: ExtractTextOptionT = { ellipsis: false }): string {
  const maxLen = option.maxLen ?? 10;
  const truncate = (input: string): string => input.length > maxLen ? `${input.substring(0, maxLen)}...` : input;
  let text = content;
  if (type === "html") {
    text = text.replace(/<[^>]+>/g, "");
    text = text.replace("&gt;", ">").replace("&lt;", "<").replace("&nbsp;", " ");
  }
  if (option.ellipsis) {
    text = truncate(text);
  }
  return text;
}
