import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { readDB } from "@/lib/db";

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const db = await readDB();
  return NextResponse.json({
    ...db,
    settings: {
      ...db.settings,
      adminPassword: "",
    },
  });
}
