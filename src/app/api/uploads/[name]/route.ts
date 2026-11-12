import fs from "node:fs";
import path from "node:path";
import { UPLOAD_DIR } from "@/lib/db";

const types: Record<string, string> = { jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", webp: "image/webp", gif: "image/gif", glb: "model/gltf-binary" };

export async function GET(_req: Request, ctx: RouteContext<"/api/uploads/[name]">) {
  const { name } = await ctx.params;
  const safe = path.basename(name);
  const file = path.join(UPLOAD_DIR, safe);
  if (!fs.existsSync(file)) return new Response("Not found", { status: 404 });
  const ext = safe.split(".").pop()?.toLowerCase() ?? "";
  return new Response(fs.readFileSync(file), {
    headers: { "Content-Type": types[ext] ?? "application/octet-stream", "Cache-Control": "public, max-age=31536000, immutable" },
  });
}
