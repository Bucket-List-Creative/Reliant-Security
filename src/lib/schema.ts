import { SITE_URL, SITE_NAME } from "@/config/site";
import type { SiteSettings } from "@/sanity/lib/types";

/**
 * Structured data for the business itself.
 *
 * Reliant is ONE business that serves many places — not one business per city.
 * Every page that describes the company therefore emits the same `@id`
 * (`<site>/#organization`), so search engines and AI systems resolve the home
 * page, the contact page, and all thirty service-area pages to a single
 * entity. Before this, each location page emitted a bare `LocalBusiness` with
 * no identifier, which models thirty separate companies.
 *
 * ⚠️ Only assert facts that are verifiable and visible on the site. There is
 * deliberately no `aggregateRating` (no verified review corpus), no
 * `streetAddress` or `postalCode` (not confirmed), no `foundingDate`, and no
 * `priceRange`. Add them when Reliant supplies them — never to fill a slot.
 */

export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

/** Verified from the live Reliant site. Sanity Site settings override these. */
const VERIFIED = {
  phone: "(636) 294-5645",
  email: "customercare@secure-reliant.com",
  locality: "O'Fallon",
  region: "MO",
  opens: "09:00",
  closes: "21:00",
};

/**
 * Authoritative profiles for `sameAs`, which is how search engines and AI
 * systems reconcile "Reliant Security" on this site with the same business
 * elsewhere. All verified 2026-09-08: the Google link resolves to the real
 * Maps place, and the BBB profile lists secure-reliant.com as its website.
 *
 * Yelp and Facebook are published by Reliant on their own site. Neither can be
 * fetched programmatically (both block automated requests), so they are
 * carried across on that basis rather than independently confirmed.
 */
const VERIFIED_PROFILES = [
  "https://g.page/r/CUCP_yQyCYQTEBM/review",
  "https://www.bbb.org/us/mo/cottleville/profile/smart-home-security/reliant-llc-0734-1000040816",
  "https://www.facebook.com/reliantllc",
  "https://www.yelp.com/biz/reliantllc",
];

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

type OrgOptions = {
  settings?: SiteSettings | null;
  /** Cities to advertise as served. Omitted entirely when empty. */
  areaServed?: string[];
  /** Extra geo point, used by the per-city pages. */
  geo?: { lat: number; lng: number };
};

/**
 * `SecuritySystemInstaller` is a documented LocalBusiness subtype and describes
 * Reliant more precisely than the generic type, so it stays the primary type.
 */
export function organizationJsonLd({
  settings,
  areaServed,
  geo,
}: OrgOptions = {}) {
  const phone = settings?.phone || VERIFIED.phone;
  const email = settings?.email || VERIFIED.email;
  // Social links from Sanity, plus the review and accreditation profiles, with
  // duplicates collapsed so a profile added in both places is listed once.
  const sameAs = [
    ...new Set(
      [
        ...(settings?.social ?? []).map((s) => s.url),
        settings?.googleReviewsUrl,
        settings?.bbbUrl,
        settings?.angiesListUrl,
        ...VERIFIED_PROFILES,
      ].filter((u): u is string => Boolean(u)),
    ),
  ];

  return {
    "@type": "SecuritySystemInstaller",
    "@id": ORGANIZATION_ID,
    name: settings?.title || SITE_NAME,
    url: `${SITE_URL}/`,
    ...(settings?.tagline ? { description: settings.tagline } : {}),
    telephone: phone,
    email,
    image: `${SITE_URL}/Images/site/og-default.jpg`,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/Images/Logo/logo-full.png`,
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: VERIFIED.locality,
      addressRegion: VERIFIED.region,
      addressCountry: "US",
    },
    ...(geo
      ? {
          geo: {
            "@type": "GeoCoordinates",
            latitude: geo.lat,
            longitude: geo.lng,
          },
        }
      : {}),
    ...(areaServed?.length
      ? { areaServed: areaServed.map((name) => ({ "@type": "City", name })) }
      : {}),
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: DAYS,
        opens: VERIFIED.opens,
        closes: VERIFIED.closes,
      },
    ],
    ...(sameAs.length ? { sameAs } : {}),
  };
}

/** Site-level node, so the brand name is unambiguous to entity extractors. */
export function webSiteJsonLd() {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: `${SITE_URL}/`,
    name: SITE_NAME,
    publisher: { "@id": ORGANIZATION_ID },
  };
}

/** Wrap nodes in a single @graph — one script tag, one connected entity set. */
export function jsonLdGraph(...nodes: object[]) {
  return { "@context": "https://schema.org", "@graph": nodes };
}

/**
 * BreadcrumbList for a detail page.
 *
 * Breadcrumb rich results are long-standing and still supported (unlike FAQ
 * rich results, which Google retired in 2026), and the trail is already
 * visible on these pages — structured data must describe what the user can
 * see, so only mark up breadcrumbs where a real trail renders.
 */
export function breadcrumbJsonLd(
  trail: { name: string; path: string }[],
) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}
