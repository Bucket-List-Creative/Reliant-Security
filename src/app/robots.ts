import type { MetadataRoute } from "next";
import { SITE_URL } from "@/config/site";

/**
 * Vercel preview deployments are served on public `*.vercel.app` URLs. Left
 * crawlable, they compete with the real domain for the same content — the
 * classic way a staging copy ends up in search results alongside production.
 * `VERCEL_ENV` is "production" only for the live deployment; anything else
 * gets a blanket disallow. Unset (local, or a non-Vercel host) keeps the
 * normal rules, so this can't quietly de-index a self-hosted deploy.
 */
const isPublicSite =
  !process.env.VERCEL_ENV || process.env.VERCEL_ENV === "production";

export default function robots(): MetadataRoute.Robots {
  if (!isPublicSite) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // The Studio is an authenticated app, not a page worth crawling.
        disallow: ["/studio", "/api/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
