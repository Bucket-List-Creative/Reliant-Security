import type { SiteSettings } from "./types";

const DEFAULT_SITE_SETTINGS: SiteSettings = {
  title: "Reliant Security",
  tagline:
    "Locally owned security and low-voltage integration — residential, commercial, industrial, and government — backed by 24/7 professional monitoring.",
};

export function fallbackSanityData(query: unknown) {
  const text = String(query);

  if (text.includes('siteSettings')) {
    return DEFAULT_SITE_SETTINGS;
  }

  if (text.includes('slug.current') && !text.includes('[0]')) {
    return [];
  }

  if (text.includes('[0]')) {
    return null;
  }

  return [];
}