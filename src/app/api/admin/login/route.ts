import { NextResponse } from "next/server";
import { ADMIN_COOKIE, checkCredentials, currentToken } from "@/lib/auth";
import { checkRateLimit, getClientIp, resetRateLimit } from "@/lib/rate-limit";

const LOGIN_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const LOGIN_MAX_ATTEMPTS = 5;

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const rlKey = `admin_login:${ip}`;
  const rl = checkRateLimit(rlKey, LOGIN_MAX_ATTEMPTS, LOGIN_WINDOW_MS);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "تم إيقاف المحاولات مؤقتًا لمدة 15 دقيقة لتجاوز الحد المسموح" },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } },
    );
  }

  const { username, password } = await req.json().catch(() => ({ username: "", password: "" }));
  const ok = await checkCredentials(String(username ?? "").slice(0, 64), String(password ?? "").slice(0, 128));
  if (!ok) {
    await new Promise((r) => setTimeout(r, 450));
    return NextResponse.json({ error: "اسم المستخدم أو كلمة المرور غير صحيحة" }, { status: 401 });
  }

  resetRateLimit(rlKey);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, await currentToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(ADMIN_COOKIE);
  return res;
}
