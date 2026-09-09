import type { Metadata } from "next";
import { SITE_NAME } from "@/config/site";

/**
 * One place to build page metadata, so every route emits a canonical URL and a
 * complete Open Graph / Twitter card without each page remembering to.
 *
 * The audit before this existed found 21 pages with no canonical and 26 with no
 * Open Graph tags at all — the homepage among them. Derive rather than retype:
 * pass the path and the copy, and the rest follows.
 *
 * `metadataBase` is set in the root layout, so relative paths here resolve to
 * absolute URLs in the rendered tags.
 */

/** Reference-size social card shipped with the site. */
export const DEFAULT_OG_IMAGE = {
  url: "/Images/site/og-default.jpg",
  width: 1200,
  height: 630,
  alt: `${SITE_NAME} — locally owned security and low-voltage integration`,
};

type Input = {
  /** Page title, without the site-name suffix — the template adds it. */
  title?: string;
  description?: string;
  /** Route path beginning with "/", e.g. "/services". Use "/" for the home page. */
  path: string;
  /** Overrides the default social card. */
  image?: { url: string; width: number; height: number; alt?: string };
  type?: "website" | "article";
  /** Set for pages that should stay out of the index. */
  noindex?: boolean;
  /** Title to use in the OG/Twitter card when it should differ. */
  socialTitle?: string;
};

export function buildMetadata({
  title,
  description,
  path,
  image = DEFAULT_OG_IMAGE,
  type = "website",
  noindex,
  socialTitle,
}: Input): Metadata {
  // Social cards are read standalone, so they carry the brand explicitly even
  // though the <title> template already appends it.
  const ogTitle = socialTitle ?? (title ? `${title} · ${SITE_NAME}` : SITE_NAME);

  return {
    ...(title ? { title } : {}),
    ...(description ? { description } : {}),
    alternates: { canonical: path },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      title: ogTitle,
      ...(description ? { description } : {}),
      url: path,
      siteName: SITE_NAME,
      locale: "en_US",
      type,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      ...(description ? { description } : {}),
      images: [image.url],
    },
  };
}
