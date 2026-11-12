import { NextResponse } from "next/server";
import { ADMIN_COOKIE, currentToken, isAdmin } from "@/lib/auth";
import { updateDB } from "@/lib/db";
import type { Settings } from "@/lib/types";

export async function PUT(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = (await req.json()) as Partial<Settings> & { newPassword?: string; newUsername?: string };
  const { newPassword, newUsername, ...rest } = body;
  delete (rest as Partial<Settings>).adminPassword;
  delete (rest as Partial<Settings>).adminUsername;
  if (newPassword && newPassword.length < 6)
    return NextResponse.json({ error: "كلمة المرور لازم تكون 6 حروف على الأقل" }, { status: 400 });
  if (newUsername !== undefined && newUsername.trim().length > 0 && newUsername.trim().length < 3)
    return NextResponse.json({ error: "اسم المستخدم لازم يكون 3 حروف على الأقل" }, { status: 400 });
  await updateDB((db) => {
    db.settings = { ...db.settings, ...rest };
    if (newPassword) db.settings.adminPassword = newPassword;
    if (newUsername?.trim()) db.settings.adminUsername = newUsername.trim();
  });
  const res = NextResponse.json({ ok: true });
  // re-issue the session cookie so the admin stays logged in after changing credentials
  res.cookies.set(ADMIN_COOKIE, await currentToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });
  return res;
}
