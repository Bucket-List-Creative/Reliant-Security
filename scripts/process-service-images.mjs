#!/usr/bin/env node
/**
 * Turn the service photography in `public/Images/New Services/` into the
 * web-sized WebP frames under `public/Images/site/` that `src/content/photos.ts`
 * points at.
 *
 * The originals are 0.5–3.5MB PNGs. `next.config.ts` sets
 * `images.unoptimized: true` (the exFAT drive corrupts Next's image cache), so
 * whatever path we reference is served byte-for-byte — linking the PNGs
 * directly would push ~20MB across the services pages.
 *
 * Everything is emitted at 1500×1000 (3:2), matching the rest of the library:
 * a 3:2 source covers both the `aspect-[16/10]` card frame and the
 * `lg:aspect-[4/3]` detail hero without further loss.
 *
 * Three sources aren't 3:2 and carry an explicit `crop`:
 *   - the two 1219×640 banners are pulled right so the Reliant logo and phone
 *     number burned into the corner survive the reframe;
 *   - the 1121×1403 portrait rack is taken from the middle, where the patch
 *     panels and cable management are.
 *
 * Usage:
 *     node scripts/process-service-images.mjs
 *     node scripts/process-service-images.mjs --dry-run
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_DIR = path.join(ROOT, "public", "Images", "New Services");
const OUT_DIR = path.join(ROOT, "public", "Images", "site");

const WIDTH = 1500;
const HEIGHT = 1000;
const QUALITY = 82;

/**
 * source → output basename, with an optional pre-crop for sources that aren't
 * already 3:2. `crop` is in source pixels and is applied before the resize.
 */
const IMAGES = [
  { src: "Access control.png", out: "access-control.webp" },
  { src: "CCTV & Hardwire.png", out: "cctv-monitor-wall.webp" },
  { src: "Managed IT.png", out: "managed-it-rack.webp" },
  { src: "cyber security.png", out: "cyber-security-noc.webp" },
  { src: "Smart H & B Automation.png", out: "smart-automation-app.webp" },
  { src: "Wireless VS.png", out: "wireless-video-aerial.webp" },
  {
    src: "Security Alarm.png",
    out: "alarm-panel.webp",
    // 1219×640 → right-aligned 960×640. Keeps the panel and the burned-in
    // logo; drops the technician's shoulder at the left edge.
    crop: { left: 259, top: 0, width: 960, height: 640 },
  },
  {
    src: "Security Installation.png",
    out: "install-exterior.webp",
    // 1219×640 → right-aligned 960×640, same reason. The technician and
    // ladder sit left of centre in the result, facing into the frame.
    crop: { left: 259, top: 0, width: 960, height: 640 },
  },
  {
    src: "Website Structure Cabling Fiber .png",
    out: "structured-cabling-rack.webp",
    // 1121×1403 portrait → the middle 1121×747, which holds the patch panels,
    // the blue Cat runs, and the top of the UPS.
    crop: { left: 0, top: 328, width: 1121, height: 747 },
  },
];

const dryRun = process.argv.includes("--dry-run");

async function main() {
  if (!dryRun) fs.mkdirSync(OUT_DIR, { recursive: true });

  for (const { src, out, crop } of IMAGES) {
    const from = path.join(SOURCE_DIR, src);
    if (!fs.existsSync(from)) {
      console.error(`  MISSING  ${src}`);
      process.exitCode = 1;
      continue;
    }

    let pipeline = sharp(from);
    if (crop) pipeline = pipeline.extract(crop);
    pipeline = pipeline
      .resize({ width: WIDTH, height: HEIGHT, fit: "cover" })
      .webp({ quality: QUALITY });

    const before = fs.statSync(from).size;
    if (dryRun) {
      const buf = await pipeline.toBuffer();
      console.log(
        `  ${out.padEnd(30)} ${kb(before)} → ${kb(buf.length)} (dry run)`,
      );
      continue;
    }

    const info = await pipeline.toFile(path.join(OUT_DIR, out));
    console.log(`  ${out.padEnd(30)} ${kb(before)} → ${kb(info.size)}`);
  }
}

const kb = (bytes) => `${(bytes / 1024).toFixed(0)}KB`.padStart(7);

main();
