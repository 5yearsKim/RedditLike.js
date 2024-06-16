
type MyEnvT = {
  STAGE: "dev"|"prod"
  API_URL: string
  SOCKET_URL: string
  // google login
  OAUTH_GOOGLE_ID: string
  // Resource(image, video) host
  RESOURCE_URL: string
}

function validateEnv(): MyEnvT {
  let STAGE = process.env.NEXT_PUBLIC_STAGE ?? "";
  if (!["dev", "prod"].includes(STAGE)) {
    console.warn(`STAGE should be one of ${["dev", "prod"]}`);
    STAGE = "dev";
  }
  let API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";
  if (API_URL == "") {
    console.warn("API_URL should be given");
    API_URL = "http://localhost:3030";
  }
  let SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL ?? "";
  if (SOCKET_URL == "") {
    console.warn("SOCKET_URL should be given");
    SOCKET_URL = "http://localhost:3031";
  }
  const OAUTH_GOOGLE_ID = process.env.NEXT_PUBLIC_OAUTH_GOOGLE_ID ?? "";
  if (OAUTH_GOOGLE_ID == "") {
    throw new Error("OAUTH_GOOGLE_ID should be given");
  }
  const RESOURCE_URL = process.env.NEXT_PUBLIC_RESOURCE_URL ?? "https://this-is-error-url.com";
  return {
    STAGE: STAGE as ("dev"|"prod"),
    API_URL,
    SOCKET_URL,
    OAUTH_GOOGLE_ID,
    RESOURCE_URL,
  };
}

export const env = validateEnv();

export const VERSION = "1.2.5";
export const MAX_FLAIR_LABEL_CNT = 24;
export const MAX_FLAG_LABEL_CNT = 16;
export const LOCALES = ["en", "ko"];


// export const VERSION = "1.2.4";


// // const fromLocal = false;
// const fromLocal = (process.env.NEXT_PUBLIC_FROM_LOCAL ?? "false") == "true";
// export const STAGE: string = process.env.NEXT_PUBLIC_STAGE ?? "dev";

// export const [API_URL, SOCKET_URL] = ((): [string, string] => {
//   if ((STAGE as any) == "prod") {
//     return ["https://nonimos-apis.textrum.kr", "https://nonimos-socket.textrum.kr"];
//   } else {
//     // dev
//     if (fromLocal) {
//       return ["http://localhost:3030", "http://localhost:3031"];
//     } else {
//       return ["wrong-url", "wrong-url"];
//     }
//   }
// })();


// export const OAUTH_GOOGLE_ID =
//   STAGE == "prod"
//     ? "437876901404-r55qjole483bhvkmr3rqg00ce2qfgtck.apps.googleusercontent.com"
//     : "127223269060-dtagat9oh7go8ieg0j0aj7289mdqe25p.apps.googleusercontent.com";

// export const MAX_FLAIR_LABEL_CNT = 24;
// export const MAX_FLAG_LABEL_CNT = 16;

// export const RESOURCE_URL = "https://resources.nonimos.com";


// export const LOCALES = ["en", "ko"];