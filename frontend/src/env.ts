
type MyEnvT = {
  STAGE: "dev"|"prod"
  API_URL: string
  API_URL_FROM_DOCKER: string
  SOCKET_URL: string
  // This features disable all oauth features and allow only fake login.
  // Good way to start empty website template without any third party dependancy(Google auth and so on)
  TEMPORARY_LOGIN_ONLY: boolean
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
  const API_URL_FROM_DOCKER = process.env.NEXT_PUBLIC_API_URL_FROM_DOCKER ?? API_URL;

  let SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL ?? "";
  if (SOCKET_URL == "") {
    console.warn("SOCKET_URL should be given");
    SOCKET_URL = "http://localhost:3031";
  }

  const TEMPORARY_LOGIN_ONLY = (process.env.NEXT_PUBLIC_TEMPORARY_LOGIN_ONLY ?? "true") == "true";

  const OAUTH_GOOGLE_ID = process.env.NEXT_PUBLIC_OAUTH_GOOGLE_ID ?? "";
  const RESOURCE_URL = process.env.NEXT_PUBLIC_RESOURCE_URL ?? "https://this-is-error-url.com";
  return {
    STAGE: STAGE as ("dev"|"prod"),
    API_URL,
    API_URL_FROM_DOCKER,
    SOCKET_URL,
    TEMPORARY_LOGIN_ONLY,
    OAUTH_GOOGLE_ID,
    RESOURCE_URL,
  };
}

export const env = validateEnv();

export const VERSION = "1.2.5";
export const MAX_FLAIR_LABEL_CNT = 24;
export const MAX_FLAG_LABEL_CNT = 16;
export const LOCALES = ["en", "ko"];

