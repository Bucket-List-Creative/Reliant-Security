/**
 * Canonical site origin used for absolute URLs (metadataBase, canonical tags,
 * Open Graph, and JSON-LD structured data). Override per environment with
 * `NEXT_PUBLIC_SITE_URL`; falls back to the production domain.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined) ||
  "https://secure-reliant.com"
).replace(/\/$/, "");

export const SITE_NAME = "Reliant Security";
