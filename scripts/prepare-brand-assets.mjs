import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const ROOT = "E:/Projects/Chameleon-MaakolatAlsham";
const UPLOADED =
  "C:/Users/antigravityadmin/.gemini/antigravity/brain/677fd6f5-8ce1-4fe3-a24a-3e6808bdb65e/.user_uploaded";
const SCRATCH =
  "C:/Users/antigravityadmin/.gemini/antigravity/brain/677fd6f5-8ce1-4fe3-a24a-3e6808bdb65e/scratch";

fs.mkdirSync(path.join(ROOT, "public/images/products"), { recursive: true });
fs.mkdirSync(path.join(ROOT, "public/images/categories"), { recursive: true });
fs.mkdirSync(path.join(ROOT, "public/images/hero"), { recursive: true });
fs.mkdirSync(path.join(ROOT, "public/images/menu-sheets"), { recursive: true });
fs.mkdirSync(path.join(ROOT, "public/menu"), { recursive: true });

/**
 * Outer-Border BFS Flood-Fill Background Knockout:
 * Removes ONLY dark background pixels physically connected to the outer edges of the image,
 * preserving 100% of interior black lettering, outlines, and details!
 */
async function knockoutOuterBlackBg(inputPath, threshold = 38) {
  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const W = info.width;
  const H = info.height;
  const visited = new Uint8Array(W * H);
  const queue = new Int32Array(W * H);
  let head = 0;
  let tail = 0;

  const brightness = (idx) => {
    const o = idx * 4;
    return Math.max(data[o], data[o + 1], data[o + 2]);
  };

  const tryPush = (x, y) => {
    if (x < 0 || x >= W || y < 0 || y >= H) return;
    const idx = y * W + x;
    if (visited[idx]) return;
    if (brightness(idx) <= threshold) {
      visited[idx] = 1;
      queue[tail++] = idx;
    }
  };

  // Seed from all 4 outer edges
  for (let x = 0; x < W; x++) {
    tryPush(x, 0);
    tryPush(x, H - 1);
  }
  for (let y = 0; y < H; y++) {
    tryPush(0, y);
    tryPush(W - 1, y);
  }

  while (head < tail) {
    const idx = queue[head++];
    const x = idx % W;
    const y = (idx / W) | 0;
    tryPush(x + 1, y);
    tryPush(x - 1, y);
    tryPush(x, y + 1);
    tryPush(x, y - 1);
  }

  // Clear visited exterior pixels + soft anti-alias 1px fringe next to visited exterior
  const out = Buffer.from(data);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const idx = y * W + x;
      const o = idx * 4;
      if (visited[idx]) {
        out[o + 3] = 0;
      } else {
        // Check if adjacent to transparent exterior for smooth anti-aliasing
        const touchesBg =
          (x > 0 && visited[idx - 1]) ||
          (x + 1 < W && visited[idx + 1]) ||
          (y > 0 && visited[idx - W]) ||
          (y + 1 < H && visited[idx + W]);
        if (touchesBg) {
          const b = brightness(idx);
          if (b < 95) {
            out[o + 3] = Math.round(((b - threshold) / (95 - threshold)) * 255);
          }
        }
      }
    }
  }

  return sharp(out, { raw: { width: W, height: H, channels: 4 } }).trim();
}

console.log("1. Processing official 4 Maakolat Al Sham logos...");

// A) Horizontal Banner Logo -> Menu page & Desktop Header (`media_1794443869685_60474cde.jpg`)
const horizLogo = await knockoutOuterBlackBg(
  path.join(UPLOADED, "media_1794443869685_60474cde.jpg"),
  42,
);
await horizLogo
  .clone()
  .resize({ width: 900, withoutEnlargement: true })
  .webp({ quality: 95, alphaQuality: 100 })
  .toFile(path.join(ROOT, "public/logo-horizontal.webp"));

// B) Simple Transparent Crest Logo -> Mobile UI (`media_1794443873253_1c43fe7f.png`)
await sharp(path.join(UPLOADED, "media_1794443873253_1c43fe7f.png"))
  .trim()
  .resize({ width: 640, withoutEnlargement: true })
  .webp({ quality: 95, alphaQuality: 100 })
  .toFile(path.join(ROOT, "public/logo-mobile.webp"));

await sharp(path.join(UPLOADED, "media_1794443873253_1c43fe7f.png"))
  .trim()
  .resize({ width: 640, withoutEnlargement: true })
  .png()
  .toFile(path.join(ROOT, "public/logo-crest.png"));

// C) Full Circular Seal Crest (`media_1794443866682_0aed15a5.jpg`)
const sealLogo = await knockoutOuterBlackBg(
  path.join(UPLOADED, "media_1794443866682_0aed15a5.jpg"),
  42,
);
await sealLogo
  .clone()
  .resize({ width: 720, withoutEnlargement: true })
  .webp({ quality: 95, alphaQuality: 100 })
  .toFile(path.join(ROOT, "public/logo-seal.webp"));

// D) Circular Mascot Emblem ONLY -> Favicon, Apple Icon, PWA Icons (`media_1794443868767_9b2b05a5.jpg`)
const emblemBase = await knockoutOuterBlackBg(
  path.join(UPLOADED, "media_1794443868767_9b2b05a5.jpg"),
  42,
);
const emblemPngBuf = await emblemBase.png().toBuffer();

for (const [file, size] of [
  ["public/logo-emblem.png", 512],
  ["public/logo-emblem.webp", 512],
  ["public/icon-512.png", 512],
  ["public/icon-192.png", 192],
  ["src/app/icon.png", 192],
  ["src/app/apple-icon.png", 180],
  ["public/favicon.ico", 64],
]) {
  const target = path.join(ROOT, file);
  const pipeline = sharp(emblemPngBuf).resize(size, size, {
    fit: "contain",
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  });
  if (file.endsWith(".webp")) {
    await pipeline.webp({ quality: 95 }).toFile(target);
  } else {
    await pipeline.png().toFile(target);
  }
}

// Maskable 512 icon on #B90D12 Sham Red safe zone
const innerEmblem = await sharp(emblemPngBuf)
  .resize(410, 410, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toBuffer();
await sharp({
  create: { width: 512, height: 512, channels: 4, background: "#B90D12" },
})
  .composite([{ input: innerEmblem, gravity: "center" }])
  .png()
  .toFile(path.join(ROOT, "public/icon-maskable-512.png"));

console.log("2. Copying official PDF menu...");
const pdfSrc = path.join(SCRATCH, "menu.pdf");
if (fs.existsSync(pdfSrc)) {
  fs.copyFileSync(pdfSrc, path.join(ROOT, "public/menu/maakolat-alsham-menu.pdf"));
}

console.log("3. Fetching and grading appetizing culinary photography...");

const PHOTO_JOBS = [
  // Wide Saj Banner & Reviews Backdrop & Hero Alternates
  {
    out: "hero/wide-saj-banner.webp",
    w: 1400,
    h: 560,
    urls: [
      "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=1400&q=85",
    ],
  },
  {
    out: "hero/reviews-backdrop.webp",
    w: 1200,
    h: 720,
    urls: [
      "https://images.unsplash.com/photo-1561651823-34feb02250e4?auto=format&fit=crop&w=1300&q=85",
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1300&q=85",
    ],
  },
  {
    out: "hero/hero-broasted-platter.webp",
    w: 900,
    h: 1050,
    urls: [
      "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=1000&q=85",
    ],
  },
  {
    out: "hero/hero-fatteh-bowl.webp",
    w: 900,
    h: 1050,
    urls: [
      "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1000&q=85",
    ],
  },
  // Products — Shawarma Sandwiches
  {
    out: "products/shawarma-chicken-saj.webp",
    w: 800,
    h: 640,
    urls: [
      "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&w=900&q=85",
    ],
  },
  {
    out: "products/shawarma-chicken-fries.webp",
    w: 800,
    h: 640,
    urls: [
      "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&w=900&q=85",
    ],
  },
  {
    out: "products/shawarma-mozzarella.webp",
    w: 800,
    h: 640,
    urls: [
      "https://images.unsplash.com/photo-1642783944285-b33b18ef6c3b?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1561651823-34feb02250e4?auto=format&fit=crop&w=900&q=85",
    ],
  },
  {
    out: "products/shawarma-french.webp",
    w: 800,
    h: 640,
    urls: [
      "https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&w=900&q=85",
    ],
  },
  {
    out: "products/shawarma-kaiser.webp",
    w: 800,
    h: 640,
    urls: [
      "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=85",
    ],
  },
  {
    out: "products/shawarma-beef-saj.webp",
    w: 800,
    h: 640,
    urls: [
      "https://images.unsplash.com/photo-1561651823-34feb02250e4?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&w=900&q=85",
    ],
  },
  // Shawarma Meals, Arabi, Maria, Kilo
  {
    out: "products/arabi-shawarma-meal.webp",
    w: 800,
    h: 640,
    urls: [
      "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=85",
    ],
  },
  {
    out: "products/arabi-double-meal.webp",
    w: 800,
    h: 640,
    urls: [
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&w=900&q=85",
    ],
  },
  {
    out: "products/shawarma-weight-kilo.webp",
    w: 800,
    h: 640,
    urls: [
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=900&q=85",
    ],
  },
  {
    out: "products/maria-mozzarella.webp",
    w: 800,
    h: 640,
    urls: [
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=900&q=85",
    ],
  },
  // Broasted Chicken
  {
    out: "products/broasted-whole.webp",
    w: 800,
    h: 640,
    urls: [
      "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=900&q=85",
    ],
  },
  {
    out: "products/broasted-half.webp",
    w: 800,
    h: 640,
    urls: [
      "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&w=900&q=85",
    ],
  },
  {
    out: "products/broasted-quarter.webp",
    w: 800,
    h: 640,
    urls: [
      "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=900&q=85",
    ],
  },
  // Grilled Chicken
  {
    out: "products/grilled-whole.webp",
    w: 800,
    h: 640,
    urls: [
      "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=900&q=85",
    ],
  },
  {
    out: "products/grilled-half.webp",
    w: 800,
    h: 640,
    urls: [
      "https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=900&q=85",
    ],
  },
  // Fatteh
  {
    out: "products/fatteh-chicken.webp",
    w: 800,
    h: 640,
    urls: [
      "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=85",
    ],
  },
  {
    out: "products/fatteh-beef.webp",
    w: 800,
    h: 640,
    urls: [
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=900&q=85",
    ],
  },
  {
    out: "products/fatteh-mozzarella.webp",
    w: 800,
    h: 640,
    urls: [
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=900&q=85",
    ],
  },
  // Western Sandwiches & Meals
  {
    out: "products/western-crispy-sub.webp",
    w: 800,
    h: 640,
    urls: [
      "https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=900&q=85",
    ],
  },
  {
    out: "products/western-shish.webp",
    w: 800,
    h: 640,
    urls: [
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=900&q=85",
    ],
  },
  {
    out: "products/western-burger.webp",
    w: 800,
    h: 640,
    urls: [
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=85",
    ],
  },
  {
    out: "products/western-crispy-meal.webp",
    w: 800,
    h: 640,
    urls: [
      "https://images.unsplash.com/photo-1562967916-eb82221dfb92?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=900&q=85",
    ],
  },
  // Pizza
  {
    out: "products/pizza-shawarma.webp",
    w: 800,
    h: 640,
    urls: [
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=900&q=85",
    ],
  },
  {
    out: "products/pizza-margherita.webp",
    w: 800,
    h: 640,
    urls: [
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=900&q=85",
    ],
  },
  {
    out: "products/pizza-supreme.webp",
    w: 800,
    h: 640,
    urls: [
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=900&q=85",
    ],
  },
  // Falafel & Fries Sandwiches
  {
    out: "products/falafel-syrian.webp",
    w: 800,
    h: 640,
    urls: [
      "https://images.unsplash.com/photo-1593001874117-c99c800e3eb7?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1547058881-aa0edd92aab3?auto=format&fit=crop&w=900&q=85",
    ],
  },
  {
    out: "products/fries-wrap.webp",
    w: 800,
    h: 640,
    urls: [
      "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=900&q=85",
    ],
  },
  // Sides, Salads, Sauces & Drinks
  {
    out: "products/side-rice.webp",
    w: 800,
    h: 640,
    urls: [
      "https://images.unsplash.com/photo-1516684732162-798a0062be99?auto=format&fit=crop&w=900&q=85",
    ],
  },
  {
    out: "products/side-fries.webp",
    w: 800,
    h: 640,
    urls: [
      "https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=900&q=85",
    ],
  },
  {
    out: "products/side-toum.webp",
    w: 800,
    h: 640,
    urls: [
      "https://images.unsplash.com/photo-1577805947697-89e18249d767?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&w=900&q=85",
    ],
  },
  {
    out: "products/side-salad.webp",
    w: 800,
    h: 640,
    urls: [
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=85",
    ],
  },
  {
    out: "products/drink-cans.webp",
    w: 800,
    h: 640,
    urls: [
      "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1581006852262-e4307cf6283a?auto=format&fit=crop&w=900&q=85",
    ],
  },
  {
    out: "products/drink-water.webp",
    w: 800,
    h: 640,
    urls: [
      "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&w=900&q=85",
    ],
  },
];

// Local Alyasmin verified fallbacks in case any remote URL times out
const LOCAL_FALLBACK = "E:/Projects/Chameleon-Alyasmin/public/images/products/shawarma-chicken-saj.webp";

for (const job of PHOTO_JOBS) {
  const dst = path.join(ROOT, "public/images", job.out);
  let ok = false;
  for (const url of job.urls) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(12000) });
      if (!res.ok) continue;
      const buf = Buffer.from(await res.arrayBuffer());
      await sharp(buf)
        .resize(job.w, job.h, { fit: "cover", position: "centre" })
        .modulate({ saturation: 1.06, brightness: 1.02 })
        .webp({ quality: 86 })
        .toFile(dst);
      ok = true;
      break;
    } catch {
      // try next url
    }
  }
  if (!ok && fs.existsSync(LOCAL_FALLBACK)) {
    await sharp(LOCAL_FALLBACK)
      .resize(job.w, job.h, { fit: "cover" })
      .webp({ quality: 86 })
      .toFile(dst);
  }
}

console.log("Brand logos and culinary photography prepared!");
