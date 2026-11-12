import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { isAdmin } from "@/lib/auth";
import { uid, UPLOAD_DIR } from "@/lib/db";
import { isR2Configured, uploadToR2 } from "@/lib/r2";
import { stampLogo } from "@/lib/stamp.mjs";

export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const fd = await req.formData();
  const file = fd.get("file");
  const stamp = fd.get("stamp") !== "false";
  if (!file || typeof file === "string") return NextResponse.json({ error: "مفيش ملف" }, { status: 400 });

  const isGlb = file.name?.toLowerCase().endsWith(".glb") || file.type === "model/gltf-binary";
  const maxBytes = isGlb ? 35 * 1024 * 1024 : 10 * 1024 * 1024;
  if (file.size > maxBytes) {
    return NextResponse.json({ error: isGlb ? "الحد الأقصى 35 ميجا لملف 3D" : "الحد الأقصى 10 ميجا" }, { status: 400 });
  }

  const input = Buffer.from(await file.arrayBuffer());

  if (isGlb) {
    const name = `model_${uid()}.glb`;
    try {
      if (isR2Configured()) {
        const publicUrl = await uploadToR2(name, input, "model/gltf-binary");
        return NextResponse.json({ url: publicUrl });
      }
      if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
      fs.writeFileSync(path.join(UPLOAD_DIR, name), input);
      return NextResponse.json({ url: `/api/uploads/${name}` });
    } catch {
      return NextResponse.json({ error: "تعذر رفع ملف 3D" }, { status: 400 });
    }
  }

  const logo = path.join(process.cwd(), "public", "logo-emblem.png");
  try {
    const out: Buffer = stamp
      ? await stampLogo(input, logo, { maxWidth: 1100, ratio: 0.2 })
      : await sharp(input).rotate().resize({ width: 1400, withoutEnlargement: true }).jpeg({ quality: 84, mozjpeg: true }).toBuffer();
    const name = `img_${uid()}.jpg`;
    if (isR2Configured()) {
      const publicUrl = await uploadToR2(`uploads/${name}`, out, "image/jpeg");
      return NextResponse.json({ url: publicUrl });
    }
    if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    fs.writeFileSync(path.join(UPLOAD_DIR, name), out);
    return NextResponse.json({ url: `/api/uploads/${name}` });
  } catch {
    return NextResponse.json({ error: "تعذر معالجة الصورة" }, { status: 400 });
  }
}
