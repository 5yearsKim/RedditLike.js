import dotenv from "dotenv";
import { z } from "zod";

if (process.cwd().endsWith("/src")) {
  // process running from src folder
  dotenv.config({ path: "../.env" });
} else {
  dotenv.config();
}

const envSchema = z.object({
  // config
  STAGE: z.enum(["dev", "prod"]),
  USER_SECRET: z.string(),
  ADMIN_SECRET: z.string(),
  SYSTEM_SECRET: z.string(),
  // DB config
  DB_USER: z.string(),
  DB_PASS: z.string(),
  DB_HOST: z.string(),
  DB_PORT: z.coerce.number(),
  DB_NAME: z.string(),
  DB_NAME_DEV: z.string(),
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

