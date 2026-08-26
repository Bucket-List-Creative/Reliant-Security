#!/usr/bin/env python3
"""
Turn the raw camera screenshots in `project-media/` into web-ready project
photos under `public/Images/Projects/<slug>/`.

The source files are phone screenshots of the live camera app, so each one
carries artefacts that must be removed before publishing:

  * black pillarbox/letterbox bars around the video
  * a timestamp + camera-name overlay along the top of the video
  * app chrome — a back chevron and a mic/mute button, both down the left edge

The originals are also ~1.2MB PNGs. `next.config.ts` sets
`images.unoptimized: true` (the exFAT drive corrupts Next's image cache), so
whatever ships is served byte-for-byte — 40MB of PNGs would be served as-is.
These are converted to JPEG, which takes the set from ~40MB to well under 4MB.

Usage:
    python3 scripts/process-project-images.py          # writes the images
    python3 scripts/process-project-images.py --dry-run

Requires Pillow. If it isn't installed globally:
    python3 -m venv .venv && .venv/bin/pip install Pillow
    .venv/bin/python scripts/process-project-images.py
"""
from __future__ import annotations

import argparse
import sys
from pathlib import Path

try:
    from PIL import Image
except ImportError:  # pragma: no cover
    sys.exit("Pillow is required — see the usage note at the top of this file.")

ROOT = Path(__file__).resolve().parent.parent
SOURCE_DIR = ROOT / "project-media"
OUT_DIR = ROOT / "public" / "Images" / "Projects"

# Fraction of the cropped video trimmed to remove app chrome. The chevron and
# mic button both sit down the left edge; the timestamp runs along the top.
TRIM_LEFT = 0.055
TRIM_TOP = 0.05

JPEG_QUALITY = 82
MAX_WIDTH = 1600

# Frames chosen per project: first is the hero, the rest fill the gallery.
# Selections favour the galvanizing process and site coverage, and skip
# near-duplicates, half-empty rooms, and employee car parks.
SELECTIONS: dict[str, tuple[str, list[str]]] = {
    "big-bend-galvanizing": (
        "BBJ Project",
        ["IMG_7850", "IMG_7854", "IMG_7853", "IMG_7855"],
    ),
    "bob-monnig-industries": (
        "BMI Project",
        ["IMG_7856", "IMG_7858", "IMG_7859", "IMG_7857"],
    ),
    "crossroads-galvanizing": (
        "CG Project",
        ["IMG_7844", "IMG_7848", "IMG_7846", "IMG_7847"],
    ),
    "indiana-galvanizing": (
        "IG Project",
        ["IMG_7863", "IMG_7864", "IMG_7867", "IMG_7866"],
    ),
    "universal-galvanizing": (
        "UG Project",
        ["IMG_7873", "IMG_7869", "IMG_7870", "IMG_7874"],
    ),
}

OUTPUT_NAMES = ["hero.jpg", "01.jpg", "02.jpg", "03.jpg"]


def video_box(im: Image.Image) -> tuple[int, int, int, int]:
    """
    Locate the actual video inside the screenshot.

    Black bars are found by scanning for near-black rows/columns. Rows are
    handled by taking the LONGEST run of non-dark rows rather than trimming
    from the edges inward: the app chrome (a white chevron on black) sits
    inside the bars and would otherwise stop an edge-in scan immediately.
    """
    grey = im.convert("L")
    w, h = grey.size
    px = grey.load()

    def row_mean(y: int) -> float:
        return sum(px[x, y] for x in range(0, w, 5)) / len(range(0, w, 5))

    def col_mean(x: int) -> float:
        return sum(px[x, y] for y in range(0, h, 5)) / len(range(0, h, 5))

    def longest_bright_run(values: list[float], threshold: float = 12.0):
        best = cur = None
        for i, v in enumerate(values):
            if v > threshold:
                if cur is None or i != cur[1] + 1:
                    cur = [i, i]
                else:
                    cur[1] = i
                if best is None or (cur[1] - cur[0]) > (best[1] - best[0]):
                    best = [cur[0], cur[1]]
            else:
                cur = None
        return (0, len(values) - 1) if best is None else (best[0], best[1])

    top, bottom = longest_bright_run([row_mean(y) for y in range(h)])
    left, right = longest_bright_run([col_mean(x) for x in range(w)])
    return (left, top, right + 1, bottom + 1)


def process(src: Path, dest: Path, dry_run: bool) -> str:
    im = Image.open(src)
    im = im.crop(video_box(im))

    # Strip the overlay/chrome margins.
    w, h = im.size
    im = im.crop((round(w * TRIM_LEFT), round(h * TRIM_TOP), w, h))

    if im.width > MAX_WIDTH:
        im = im.resize(
            (MAX_WIDTH, round(im.height * MAX_WIDTH / im.width)), Image.LANCZOS
        )

    if dry_run:
        return f"{im.size[0]}x{im.size[1]} (dry run)"

    dest.parent.mkdir(parents=True, exist_ok=True)
    im.convert("RGB").save(dest, "JPEG", quality=JPEG_QUALITY, optimize=True)
    return f"{im.size[0]}x{im.size[1]}  {dest.stat().st_size / 1024:.0f}KB"


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    if not SOURCE_DIR.is_dir():
        sys.exit(f"Source directory not found: {SOURCE_DIR}")

    total = 0
    for slug, (folder, stems) in SELECTIONS.items():
        print(f"\n{slug}")
        for stem, out_name in zip(stems, OUTPUT_NAMES):
            src = SOURCE_DIR / folder / f"{stem}.PNG"
            if not src.exists():
                print(f"  ! missing {src}")
                continue
            info = process(src, OUT_DIR / slug / out_name, args.dry_run)
            print(f"  {stem}.PNG -> {out_name:9s} {info}")
            total += 1

    print(f"\nProcessed {total} images into {OUT_DIR}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
