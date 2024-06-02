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
      return ["http://localhost:5000", "http://localhost:5500"];
    } else {
      return ["wrong-url", "wrong-url"];
    }
  }
})();

export const FB_CONFIG =
  STAGE == "prod"
    ? {
      apiKey: "AIzaSyDFU3Wzy5WKYU8CLyFY9I4QqdiUKd2y6t0",
      authDomain: "keddit-prod.firebaseapp.com",
      projectId: "keddit-prod",
      storageBucket: "keddit-prod.appspot.com",
      messagingSenderId: "408776941193",
      appId: "1:408776941193:web:6bb2ba9b12bb3777e8f058",
      measurementId: "G-L4EBCD8RLN",
    }
    : {
      apiKey: "AIzaSyA0oz21QLPk3UqQRKFZ2U8EIqtqKN1Xwsg",
      authDomain: "keddit-dev-e61ba.firebaseapp.com",
      projectId: "keddit-dev-e61ba",
      storageBucket: "keddit-dev-e61ba.appspot.com",
      messagingSenderId: "877209191484",
      appId: "1:877209191484:web:34e83ea9660d8a9980ef39",
      measurementId: "G-2SXQW9R8HH",
    };

export const OAUTH_GOOGLE_ID =
  STAGE == "prod"
    ? "437876901404-r55qjole483bhvkmr3rqg00ce2qfgtck.apps.googleusercontent.com"
    : "127223269060-dtagat9oh7go8ieg0j0aj7289mdqe25p.apps.googleusercontent.com";

// firebase messaging web push certificate pub key
export const FB_VAPID_KEY =
  STAGE == "prod" ? "" : "BJwQBIsz7-jGnqZ_erGHzTYgnDTrB1vtpDrk_f8N4YCqf0pOtv-6uzUVBVa8f47dJ08tdlzjrGDSdmQ3rZwTXCI";

export const MAX_FLAIR_LABEL_CNT = 24;
export const MAX_FLAG_LABEL_CNT = 16;

export const RESOURCE_URL = "https://resources.nonimos.com";


export const LOCALES = ["en", "ko"];