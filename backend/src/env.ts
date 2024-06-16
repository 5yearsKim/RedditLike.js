import dotenv from "dotenv";
import { z } from "zod";
import path from "path";
import fg from "fast-glob";

function fetchEnvPath(): string|null {
  const envFiles = fg.sync(".env.*");

  for (const cand of [".env.dev", ".env.test", ".env.prod"]) {
    const envFile = envFiles.find((val) => val == cand);
    if (envFile) {
      return envFile;
    }
  }
  return null;
}

const cwd = process.cwd();

// called on knex script on load knexfile standalone
if (cwd.endsWith("/src") || cwd.endsWith("/dist")) {
  process.chdir(path.join(__dirname, ".."));
}

// set env variable if not set

const envPath = fetchEnvPath();

if (envPath) {
  dotenv.config({ path: envPath });
}


const envSchema = z.object({
  // config
  STAGE: z.enum(["dev", "prod"]),
  APP_SECRET: z.string(),
  // DB config
  DB_USER: z.string(),
  DB_PASS: z.string(),
  DB_HOST: z.string(),
  DB_PORT: z.coerce.number(),
  DB_NAME: z.string(),
  // aws
  AWS_ACCESS_KEY_ID: z.string(),
  AWS_SECRET_KEY_ID: z.string(),
  AWS_BUCKET_NAME: z.string(),
  // nodemailer
  GMAIL_MAIL: z.string(),
  GMAIL_PASS: z.string(),
});


export const env = envSchema.parse(process.env);


export const MAIN_PORT = 3030;
export const SOCKET_PORT = 3031;


export const USER_SECRET = "user:" + env.APP_SECRET;
export const SYSTEM_SECRET = "system:" + env.APP_SECRET;

