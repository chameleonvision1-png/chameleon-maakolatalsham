import "server-only";
import crypto from "node:crypto";

const ACCOUNT_ID = process.env.R2_ACCOUNT_ID || process.env.CLOUDFLARE_ACCOUNT_ID || "";
const ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID || "";
const SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY || "";
const BUCKET = process.env.R2_BUCKET_NAME || "alban3sal-3d";
const PUBLIC_BASE = (process.env.R2_PUBLIC_URL || "").replace(/\/$/, "");

export function isR2Configured(): boolean {
  return Boolean(ACCOUNT_ID && ACCESS_KEY_ID && SECRET_ACCESS_KEY && PUBLIC_BASE);
}

function hmac(key: crypto.BinaryLike | crypto.KeyObject, data: string): Buffer {
  return crypto.createHmac("sha256", key).update(data, "utf8").digest();
}

function sha256Hex(data: Buffer | string): string {
  return crypto.createHash("sha256").update(data).digest("hex");
}

/**
 * Uploads a buffer to Cloudflare R2 via S3-compatible Signature V4 API
 * and returns the public URL.
 */
export async function uploadToR2(
  key: string,
  body: Buffer,
  contentType = "image/jpeg",
): Promise<string> {
  const cleanKey = key.replace(/^\/+/, "");
  const host = `${ACCOUNT_ID}.r2.cloudflarestorage.com`;
  const region = "auto";
  const service = "s3";

  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, "");
  const dateStamp = amzDate.slice(0, 8);

  const payloadHash = sha256Hex(body);
  const cacheControl = "public, max-age=31536000, immutable";
  const canonicalUri = `/${BUCKET}/${cleanKey}`;

  const canonicalHeaders =
    `cache-control:${cacheControl}\n` +
    `content-type:${contentType}\n` +
    `host:${host}\n` +
    `x-amz-content-sha256:${payloadHash}\n` +
    `x-amz-date:${amzDate}\n`;

  const signedHeaders = "cache-control;content-type;host;x-amz-content-sha256;x-amz-date";
  const canonicalRequest = [
    "PUT",
    canonicalUri,
    "",
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join("\n");

  const algorithm = "AWS4-HMAC-SHA256";
  const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
  const stringToSign = [
    algorithm,
    amzDate,
    credentialScope,
    sha256Hex(canonicalRequest),
  ].join("\n");

  const kDate = hmac(`AWS4${SECRET_ACCESS_KEY}`, dateStamp);
  const kRegion = hmac(kDate, region);
  const kService = hmac(kRegion, service);
  const kSigning = hmac(kService, "aws4_request");
  const signature = crypto
    .createHmac("sha256", kSigning)
    .update(stringToSign, "utf8")
    .digest("hex");

  const authorization = `${algorithm} Credential=${ACCESS_KEY_ID}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

  const res = await fetch(`https://${host}${canonicalUri}`, {
    method: "PUT",
    headers: {
      "Cache-Control": cacheControl,
      "Content-Type": contentType,
      "x-amz-content-sha256": payloadHash,
      "x-amz-date": amzDate,
      Authorization: authorization,
    },
    body: new Uint8Array(body),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`R2 upload failed (${res.status}): ${errText}`);
  }

  return `${PUBLIC_BASE}/${cleanKey}`;
}
