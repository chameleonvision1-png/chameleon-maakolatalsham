import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { readDB, uid, updateDB, UPLOAD_DIR } from "@/lib/db";
import { isAdmin } from "@/lib/auth";
import { isR2Configured, uploadToR2 } from "@/lib/r2";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { occasionWhatsAppText, waLink } from "@/lib/whatsapp";
import type { OccasionRequest } from "@/lib/types";

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  return NextResponse.json((await readDB()).occasions);
}

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const rl = checkRateLimit(`occasions:${ip}`, 5, 10 * 60 * 1000);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "تم إرسال طلبات كثيرة في وقت قصير، يرجى الانتظار قليلًا" },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } },
    );
  }

  const fd = await req.formData().catch(() => null);
  if (!fd) return NextResponse.json({ error: "بيانات غير صالحة" }, { status: 400 });
  const get = (k: string) => String(fd.get(k) ?? "").trim();
  const name = get("name"), phone = get("phone").replace(/\s/g, ""), type = get("type");
  const quantity = get("quantity"), date = get("date"), branchId = get("branchId"), details = get("details");

  if (!name || !type || !date) return NextResponse.json({ error: "من فضلك كمّل البيانات المطلوبة" }, { status: 400 });
  if (!/^01[0125]\d{8}$/.test(phone)) return NextResponse.json({ error: "رقم الموبايل غير صحيح" }, { status: 400 });

  const db = await readDB();
  const branch = db.branches.find((b) => b.id === branchId) ?? db.branches[0];

  let attachment = "";
  const file = fd.get("image");
  if (file && typeof file !== "string" && file.size > 0) {
    if (file.size > 6 * 1024 * 1024) return NextResponse.json({ error: "حجم الصورة كبير (الحد 6 ميجا)" }, { status: 400 });
    const rawBuf = Buffer.from(await file.arrayBuffer());
    let safeJpeg: Buffer;
    try {
      // Re-encode with sharp to strip metadata and block any non-image / malicious file upload
      safeJpeg = await sharp(rawBuf)
        .rotate()
        .resize({ width: 1200, withoutEnlargement: true })
        .jpeg({ quality: 82, mozjpeg: true })
        .toBuffer();
    } catch {
      return NextResponse.json({ error: "ملف الصورة غير صالح" }, { status: 400 });
    }
    const fname = `occ_${uid()}.jpg`;
    if (isR2Configured()) {
      attachment = await uploadToR2(`uploads/${fname}`, safeJpeg, "image/jpeg");
    } else {
      if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
      fs.writeFileSync(path.join(UPLOAD_DIR, fname), safeJpeg);
      attachment = `/api/uploads/${fname}`;
    }
  }

  const rec = await updateDB((d) => {
    const r: OccasionRequest = {
      id: uid("occ_"),
      name: name.slice(0, 80),
      phone,
      type: type.slice(0, 60),
      quantity: quantity.slice(0, 60),
      date: date.slice(0, 40),
      branchId: branch.id,
      details: (details + (attachment ? `\nصورة مرجعية: ${attachment}` : "")).slice(0, 1200),
      status: "new",
      createdAt: new Date().toISOString(),
    };
    d.occasions.unshift(r);
    return r;
  });

  return NextResponse.json({ ok: true, whatsappUrl: waLink(branch.whatsapp, occasionWhatsAppText(rec, branch)) });
}
