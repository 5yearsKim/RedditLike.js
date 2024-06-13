export const VERSION = "1.2.4";


// const fromLocal = false;
const fromLocal = (process.env.NEXT_PUBLIC_FROM_LOCAL ?? "false") == "true";
export const STAGE: string = process.env.NEXT_PUBLIC_STAGE ?? "dev";

export const [API_URL, SOCKET_URL] = ((): [string, string] => {
  if ((STAGE as any) == "prod") {
    return ["https://nonimos-apis.textrum.kr", "https://nonimos-socket.textrum.kr"];
  } else {
    // dev
    if (fromLocal) {
      return ["http://localhost:3030", "http://localhost:3031"];
    } else {
      return ["wrong-url", "wrong-url"];
    }
  }
})();


export const OAUTH_GOOGLE_ID =
  STAGE == "prod"
    ? "437876901404-r55qjole483bhvkmr3rqg00ce2qfgtck.apps.googleusercontent.com"
    : "127223269060-dtagat9oh7go8ieg0j0aj7289mdqe25p.apps.googleusercontent.com";

export const MAX_FLAIR_LABEL_CNT = 24;
export const MAX_FLAG_LABEL_CNT = 16;

export const RESOURCE_URL = "https://resources.nonimos.com";


export const LOCALES = ["en", "ko"];