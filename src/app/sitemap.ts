import type { MetadataRoute } from "next";
import { SITE_URL } from "@/config/site";
import { LOCATIONS } from "@/content/locations";
import { POSTS, RETIRED_POST_SLUGS } from "@/content/posts";
import { ALL_SERVICE_SLUGS } from "@/content/services";
import { PROJECTS } from "@/content/projects";
import { LEGAL_PAGES } from "@/content/legal";
import { INDUSTRIES } from "@/content/industries";
import { client } from "@/sanity/lib/client";
import { POST_SLUGS_QUERY, SERVICE_SLUGS_QUERY } from "@/sanity/lib/queries";

/**
 * Built from the repo's own taxonomies plus whatever extra slugs exist in
 * Sanity, so a page added in the CMS is discoverable without a redeploy of
 * this file. Sanity failures are swallowed — a sitemap missing a new post is
 * far better than a build that falls over because the CMS was unreachable.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPaths = [
    { path: "", priority: 1 },
    { path: "/services", priority: 0.9 },
    { path: "/industries", priority: 0.8 },
    { path: "/projects", priority: 0.7 },
    { path: "/pricing", priority: 0.7 },
    { path: "/resources", priority: 0.7 },
    { path: "/blog", priority: 0.7 },
    { path: "/areas-we-serve", priority: 0.8 },
    { path: "/about", priority: 0.8 },
    { path: "/contact", priority: 0.8 },
  ];

  const [cmsPosts, cmsServices] = await Promise.all([
    client
      .withConfig({ useCdn: false })
      .fetch<{ slug: string }[]>(POST_SLUGS_QUERY)
      .catch(() => [] as { slug: string }[]),
    client
      .withConfig({ useCdn: false })
      .fetch<{ slug: string }[]>(SERVICE_SLUGS_QUERY)
      .catch(() => [] as { slug: string }[]),
  ]);

  const serviceSlugs = new Set<string>(ALL_SERVICE_SLUGS);
  for (const { slug } of cmsServices) if (slug) serviceSlugs.add(slug);

  const postSlugs = new Set<string>(POSTS.map((p) => p.slug));
  for (const { slug } of cmsPosts) if (slug) postSlugs.add(slug);
  // A redirected URL must never appear in the sitemap.
  for (const slug of RETIRED_POST_SLUGS) postSlugs.delete(slug);

  return [
    ...staticPaths.map(({ path, priority }) => ({
      url: `${SITE_URL}${path}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority,
    })),
    // Location pages sit at the root, matching the previous site's URLs.
    ...LOCATIONS.map((l) => ({
      url: `${SITE_URL}/${l.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...[...serviceSlugs].map((slug) => ({
      url: `${SITE_URL}/services/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    // Industry detail pages were absent from the sitemap entirely.
    ...INDUSTRIES.map((i) => ({
      url: `${SITE_URL}/industries/${i.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...PROJECTS.map((p) => ({
      url: `${SITE_URL}/projects/${p.slug}`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
    ...[...postSlugs].map((slug) => ({
      url: `${SITE_URL}/blog/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...LEGAL_PAGES.map((p) => ({
      url: `${SITE_URL}/${p.slug}`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
  ];
}
