import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "@/global/s3";
import { env } from "@/env";
import P from "path";

export async function createSignedUrl(key: string, contentType: string): Promise<string> {
  const comamand = new PutObjectCommand({
    Bucket: env.AWS_BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  });
  const signedUrl = await getSignedUrl(s3Client, comamand, { expiresIn: 60 * 60 * 24 * 7 });
  return signedUrl;
}

export function addDevOnKey(key: string): string {
  if (env.STAGE == "dev") {
    key = P.join("dev", key);
  }
  return key;
}