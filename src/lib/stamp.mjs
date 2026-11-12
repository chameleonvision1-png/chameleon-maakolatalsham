// Shared logo-stamping logic: composites the ORIGINAL Alban Asal logo onto a photo.
// Used by scripts/brand-images.mjs (batch) and the admin upload API.
import sharp from "sharp";

/**
 * @param {Buffer|string} input  image buffer or path
 * @param {Buffer|string} logo   logo buffer or path (transparent PNG)
 * @param {{maxWidth?: number, ratio?: number, quality?: number}} [opts]
 * @returns {Promise<Buffer>} JPEG buffer
 */
export async function stampLogo(input, logo, opts = {}) {
  const { maxWidth = 1600, ratio = 0.17, quality = 84 } = opts;
  const base = sharp(input).rotate().resize({ width: maxWidth, withoutEnlargement: true });
  const { data, info } = await base.toBuffer({ resolveWithObject: true });
  const short = Math.min(info.width, info.height);
  const size = Math.max(64, Math.round(short * ratio));
  const margin = Math.round(short * 0.035);

  const logoBuf = await sharp(logo).resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();

  // soft drop shadow behind the logo so it reads on any background
  const pad = Math.round(size * 0.12);
  const shadowSize = size + pad * 2;
  const shadow = await sharp({
    create: { width: shadowSize, height: shadowSize, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([
      {
        input: Buffer.from(
          `<svg width="${shadowSize}" height="${shadowSize}"><circle cx="${shadowSize / 2}" cy="${shadowSize / 2 + pad * 0.3}" r="${size / 2}" fill="rgba(0,0,0,0.28)"/></svg>`,
        ),
      },
    ])
    .blur(Math.max(1, pad * 0.6))
    .png()
    .toBuffer();

  // bottom-right corner: in image coordinates (not RTL) right = width - size - margin
  const left = opts.position?.includes("left") ? margin + pad : info.width - size - margin;
  const top = opts.position?.startsWith("top") ? margin + pad : info.height - size - margin;

  return sharp(data)
    .composite([
      { input: shadow, left: left - pad, top: top - pad },
      { input: logoBuf, left, top },
    ])
    .jpeg({ quality, mozjpeg: true })
    .toBuffer();
}
