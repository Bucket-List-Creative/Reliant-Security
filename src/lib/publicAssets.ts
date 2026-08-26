import fs from "node:fs";
import path from "node:path";

/**
 * Server-only existence checks for files under `public/`.
 *
 * Project photography arrives in batches, and the taxonomy in
 * `src/content/projects.ts` names the paths up front so files can simply be
 * dropped in place. Until a given file exists, `next/image` would render a
 * broken image — so pages check first and fall back to `ImagePlaceholder`.
 *
 * Only ever call this from Server Components.
 */
const PUBLIC_DIR = path.join(process.cwd(), "public");

export function publicAssetExists(assetPath?: string): boolean {
  if (!assetPath) return false;
  // Reject anything that tries to escape `public/`.
  const relative = assetPath.replace(/^\/+/, "");
  if (relative.includes("..")) return false;
  try {
    return fs.existsSync(path.join(PUBLIC_DIR, relative));
  } catch {
    return false;
  }
}

/** Filter a list of public paths down to the ones that actually exist. */
export function existingPublicAssets(assetPaths?: string[]): string[] {
  return (assetPaths ?? []).filter(publicAssetExists);
}

/** Return the path only when the file is present, else undefined. */
export function publicAssetOrUndefined(
  assetPath?: string,
): string | undefined {
  return publicAssetExists(assetPath) ? assetPath : undefined;
}
