import "server-only";
import crypto from "node:crypto";
import { cookies } from "next/headers";
import { readDB } from "./db";

const COOKIE = "maakolatalsham_admin";
const SECRET = process.env.ADMIN_SECRET || "maakolatalsham-local-secret-change-me";

function sign(value: string) {
  return crypto.createHmac("sha256", SECRET).update(value).digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const ha = crypto.createHmac("sha256", SECRET).update(a).digest();
  const hb = crypto.createHmac("sha256", SECRET).update(b).digest();
  return crypto.timingSafeEqual(ha, hb);
}

async function creds() {
  const db = await readDB();
  const s = db.settings;
  return { username: s.adminUsername || "admin", password: s.adminPassword };
}

export function makeToken(username: string, password: string) {
  return sign(`admin:${username}:${password}`);
}

export async function currentToken() {
  const c = await creds();
  return makeToken(c.username, c.password);
}

export async function checkCredentials(username: string, password: string) {
  const c = await creds();
  const userMatch = safeEqual(username.trim().toLowerCase(), c.username.toLowerCase());
  const passMatch = safeEqual(password, c.password);
  return userMatch && passMatch;
}

export async function isAdmin() {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  if (!token) return false;
  const expected = await currentToken();
  return safeEqual(token, expected);
}

export const ADMIN_COOKIE = COOKIE;
