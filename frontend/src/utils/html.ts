type ExtractTextOptionT = {
  ellipsis?: boolean;
  maxLen?: number;
};

export function extractText(
  content: string,
  type: "md" | "html" | "text",
  option: ExtractTextOptionT = { ellipsis: false },
): string {
  const maxLen = option.maxLen ?? 10;
  const truncate = (input: string): string => (input.length > maxLen ? `${input.substring(0, maxLen)}...` : input);
  let text = content;
  if (type === "html") {
    text = text.replace(/<\/p>/g, "</p>\n"); // additional space
    text = text.replace(/<[^>]+>/g, "").replace(/<\/[^>]+>/g, " ");
    text = text.replace("&gt;", ">").replace("&lt;", "<").replace("&nbsp;", " ");
    text = text.replace(/^\s+/, ""); // remove leading whitespace and newline
  }
  if (option.ellipsis) {
    text = truncate(text);
  }
  return text;
}

export function trimHtml(body: string): string {
  let cand = "<p><br></p>";
  while (body.endsWith(cand)) {
    body = body.slice(0, body.length - cand.length);
  }
  cand = "<p></p>";
  while (body.endsWith(cand)) {
    body = body.slice(0, body.length - cand.length);
  }
  return body;
}

// https://stackoverflow.com/questions/14202976/what-is-the-easiest-way-to-check-if-string-contains-any-image-tag
export function retrieveHtmlImages(htmlString: string): HTMLImageElement[] {
  if (!htmlString.includes("<img")) {
    return [];
  }
  const div = document.createElement("div");
  div.innerHTML = htmlString;

  const imgs = div.querySelectorAll("img");
  return Array.from(imgs);
}

export function retrieveHtmlImagesSrc(htmlString: string): string[] {
  if (!htmlString.includes("<img")) {
    return [];
  }
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, "text/html");
  const imgTags = doc.getElementsByTagName("img");
  const srcList = Array.from(imgTags)
    .map((img) => img.getAttribute("src"))
    .filter((src) => Boolean(src));
  return srcList as string[];
}

export function retrieveYoutubeThumbnail(htmlString: string): string | null {
  if (!htmlString.includes("youtube.com")) {
    return null;
  }
  const parser = new DOMParser();
  const htmlDoc = parser.parseFromString(htmlString, "text/html");
  const iframes = htmlDoc.getElementsByTagName("iframe");
  if (!iframes.length) {
    return null;
  }
  const embeddableURL = iframes[0].src;
  if (!embeddableURL.includes("youtube.com")) {
    return null;
  }
  const youtubeId = new URL(embeddableURL).pathname.split("/").pop();

  if (!youtubeId) {
    return null;
  }

  return `https://img.youtube.com/vi/${youtubeId}/0.jpg`;
}

export function retrieveLinkPreviewUrl(htmlString: string): string | null {
  if (!htmlString.includes("<link-preview")) {
    return null;
  }
  const parser = new DOMParser();
  const htmlDoc = parser.parseFromString(htmlString, "text/html");
  const previews = htmlDoc.getElementsByTagName("link-preview");
  if (!previews.length) {
    return null;
  }
  return previews[0].getAttribute("url");
}

export function retrieveTweetId(htmlString: string): string | null {
  if (!htmlString.includes("<tweet")) {
    return null;
  }
  const parser = new DOMParser();
  const htmlDoc = parser.parseFromString(htmlString, "text/html");
  const tweets = htmlDoc.getElementsByTagName("tweet");
  if (!tweets.length) {
    return null;
  }
  return tweets[0].getAttribute("id");
}


export function retrievePollId(htmlString: string): idT | null {
  if (!htmlString.includes("<poll-item")) {
    return null;
  }
  const parser = new DOMParser();
  const htmlDoc = parser.parseFromString(htmlString, "text/html");
  const polls = htmlDoc.getElementsByTagName("poll-item");
  if (!polls.length) {
    return null;
  }
  const pollId = polls[0].getAttribute("id");
  if (!pollId) {
    return null;
  }
  return parseInt(pollId);
}