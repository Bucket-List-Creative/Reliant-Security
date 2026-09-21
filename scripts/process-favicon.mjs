#!/usr/bin/env node
/**
 * Build the app icons from the brand mark in `public/Favicon/`.
 *
 * Next resolves icons by file convention out of `src/app/` (see
 * `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/01-metadata/app-icons.md`),
 * so the outputs land there rather than in `public/`:
 *
 *   src/app/favicon.ico     multi-size ICO — what `/favicon.ico` serves, and
 *                           what crawlers and feed readers still request by
 *                           path rather than reading the <link> tags
 *   src/app/icon.png        the <link rel="icon"> browsers actually prefer
 *   src/app/apple-icon.png  <link rel="apple-touch-icon">, iOS home screen
 *
 * The ICO is assembled by hand because sharp has no ICO encoder. The format is
 * a 6-byte directory header, one 16-byte entry per image, then the image
 * payloads — and since Vista those payloads may be PNG rather than BMP, which
 * every browser in use now reads. That avoids pulling in a dependency to write
 * about forty bytes of header.
 *
 * Usage:
 *     node scripts/process-favicon.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE = path.join(ROOT, "public", "Favicon", "Reliant-fevicon.png");
const APP_DIR = path.join(ROOT, "src", "app");

/** Sizes packed into favicon.ico. 48 covers Windows tiles and pinned tabs. */
const ICO_SIZES = [16, 32, 48];

/**
 * The source mark is 180x180 with no alpha — a green padlock on white. It is
 * never upscaled: 180 is already the exact apple-touch-icon size, and blowing
 * a flat vector-style mark up to 512 only softens its edges.
 */
const PNG_SIZE = 180;

/**
 * Every output is forced to RGBA. Next decodes these files to work out the
 * `sizes` and `type` on the <link> tags it generates, and its decoder rejects
 * a non-RGBA PNG outright ("The PNG is not in RGBA format!") — which fails the
 * whole metadata pass, so no icon tags are emitted at all. The source has no
 * alpha channel, so without this every build hits that error. It also makes
 * the ICO honest: its directory entries declare 32 bits per pixel.
 */
const toRgbaPng = (pipeline) =>
  pipeline.ensureAlpha().png({ compressionLevel: 9, force: true });

function buildIco(pngs) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // 1 = icon
  header.writeUInt16LE(pngs.length, 4);

  const entries = [];
  let offset = 6 + pngs.length * 16;

  for (const { size, data } of pngs) {
    const entry = Buffer.alloc(16);
    // 0 means 256 in this field; our sizes are all smaller, but keep the
    // modulo so a 256px entry can be added later without a silent overflow.
    entry.writeUInt8(size % 256, 0);
    entry.writeUInt8(size % 256, 1);
    entry.writeUInt8(0, 2); // palette size — 0 for truecolour
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // colour planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(data.length, 8);
    entry.writeUInt32LE(offset, 12);
    entries.push(entry);
    offset += data.length;
  }

  return Buffer.concat([header, ...entries, ...pngs.map((p) => p.data)]);
}

async function main() {
  if (!fs.existsSync(SOURCE)) {
    console.error(`  MISSING  ${path.relative(ROOT, SOURCE)}`);
    process.exitCode = 1;
    return;
  }

  const meta = await sharp(SOURCE).metadata();
  console.log(`  source   ${meta.width}x${meta.height} ${meta.format}`);

  const icoPngs = [];
  for (const size of ICO_SIZES) {
    icoPngs.push({
      size,
      data: await toRgbaPng(sharp(SOURCE).resize(size, size)).toBuffer(),
    });
  }

  const ico = buildIco(icoPngs);
  fs.writeFileSync(path.join(APP_DIR, "favicon.ico"), ico);
  console.log(`  favicon.ico     ${ICO_SIZES.join("/")}px  ${kb(ico.length)}`);

  for (const name of ["icon.png", "apple-icon.png"]) {
    const out = path.join(APP_DIR, name);
    const info = await toRgbaPng(
      sharp(SOURCE).resize(PNG_SIZE, PNG_SIZE),
    ).toFile(out);
    console.log(`  ${name.padEnd(15)} ${PNG_SIZE}px  ${kb(info.size)}`);
  }
}

const kb = (bytes) => `${(bytes / 1024).toFixed(1)}KB`;

main();
