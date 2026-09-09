/**
 * Generate an NDJSON export of the site's built-in content taxonomy, ready to
 * import into Sanity.
 *
 *   npx tsx scripts/seed-sanity.ts                 # writes scripts/seed.ndjson
 *   npx sanity dataset import scripts/seed.ndjson production --replace
 *
 * The data is read from the SAME modules the site renders from
 * (`src/content/*`), so the Studio and the built-in defaults can't drift apart
 * at seed time. Re-running is safe: document `_id`s are deterministic, so
 * `--replace` overwrites rather than duplicating.
 *
 * Deliberately NOT seeded:
 *   • testimonial — the built-in ones are placeholders, not real reviews.
 *     Seeding them would make invented quotes look editorially approved.
 *   • partner — the current list is unconfirmed; Reliant should enter the
 *     real manufacturers themselves.
 *
 * `siteSettings` IS seeded, but only with details verified against Reliant's
 * own live site and its BBB profile (checked 2026-09-08). Nothing here is
 * inferred. The address is deliberately city/state only — no street address is
 * published on the site, and the BBB profile lists a different municipality
 * (see the audit notes), so asserting one would risk an NAP conflict.
 */
import { writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { SERVICE_CATEGORIES } from "../src/content/services";
import { INDUSTRIES } from "../src/content/industries";
import { PROJECTS } from "../src/content/projects";
import { POSTS, POST_CATEGORIES } from "../src/content/posts";
import { LOCATIONS, locationCopy } from "../src/content/locations";
import { LEGAL_PAGES } from "../src/content/legal";
import { PHOTOS, SERVICE_PHOTOS } from "../src/content/photos";
import {
  HOME_DEFAULTS,
  HOME_CAPABILITIES,
  ABOUT_DEFAULTS,
  ABOUT_DIFFERENTIATORS,
  ABOUT_CUSTOMERS,
  SERVICES_PAGE_DEFAULTS,
  NAV_DEFAULTS,
} from "../src/content/pages";

type Doc = Record<string, unknown> & { _id: string; _type: string };

/**
 * Reference a file in `public/` as a Sanity image asset.
 *
 * `sanity dataset import` uploads anything under a `_sanityAsset` key and
 * swaps in the real reference, so the shipped crops become CDN-served assets
 * the owner can replace in the Studio. Sanity dedupes by content hash, so a
 * photo used on two documents is stored once.
 */
const PUBLIC_DIR = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "public",
);

const imageAsset = (publicPath: string, alt: string) => ({
  _type: "image",
  alt,
  _sanityAsset: `image@file://${join(PUBLIC_DIR, publicPath.replace(/^\//, ""))}`,
});

/**
 * Same, but returns undefined when the file isn't on disk.
 *
 * Project photography arrives in batches and `src/content/projects.ts` names
 * the paths before the files exist. A `_sanityAsset` pointing at a missing
 * file fails the whole import, so anything optional has to be checked first.
 */
const imageAssetIfPresent = (publicPath: string | undefined, alt: string) => {
  if (!publicPath) return undefined;
  const abs = join(PUBLIC_DIR, publicPath.replace(/^\//, ""));
  return existsSync(abs) ? imageAsset(publicPath, alt) : undefined;
};

const docs: Doc[] = [];

/** Sanity slug field shape. */
const slug = (current: string) => ({ _type: "slug", current });

/** Stable `_key` for array members, derived from position. */
const keyed = <T extends object>(items: T[], prefix: string) =>
  items.map((item, i) => ({ _key: `${prefix}${i}`, ...item }));

/* ---------------------------------------------------------------- */
/*  Services                                                         */
/* ---------------------------------------------------------------- */
let serviceOrder = 0;
for (const category of SERVICE_CATEGORIES) {
  for (const svc of category.services) {
    serviceOrder += 10;
    docs.push({
      _id: `service-${svc.slug}`,
      _type: "service",
      title: svc.title,
      slug: slug(svc.slug),
      category: category.slug,
      iconKey: svc.iconKey,
      summary: svc.summary,
      features: svc.features,
      ...(SERVICE_PHOTOS[svc.slug]
        ? {
            heroImage: imageAsset(
              SERVICE_PHOTOS[svc.slug].src,
              SERVICE_PHOTOS[svc.slug].alt,
            ),
          }
        : {}),
      benefits: keyed(
        svc.benefits.map((b) => ({
          _type: "benefit",
          title: b.title,
          description: b.description,
        })),
        "b",
      ),
      faqs: keyed(
        svc.faqs.map((f) => ({
          _type: "faq",
          question: f.question,
          answer: f.answer,
        })),
        "f",
      ),
      order: serviceOrder,
    });
  }
}

/* ---------------------------------------------------------------- */
/*  Industries                                                       */
/* ---------------------------------------------------------------- */
INDUSTRIES.forEach((ind, i) => {
  docs.push({
    _id: `industry-${ind.slug}`,
    _type: "industry",
    name: ind.name,
    slug: slug(ind.slug),
    iconKey: ind.iconKey,
    summary: ind.summary,
    segments: ind.segments,
    threats: keyed(
      ind.threats.map((t) => ({
        _type: "threat",
        title: t.title,
        description: t.description,
      })),
      "t",
    ),
    solutions: keyed(
      ind.solutions.map((s) => ({
        _type: "solution",
        title: s.title,
        description: s.description,
      })),
      "s",
    ),
    services: keyed(
      ind.serviceSlugs.map((s) => ({
        _type: "reference",
        _ref: `service-${s}`,
      })),
      "r",
    ),
    featured: ind.featured ? "featured" : "standard",
    order: (i + 1) * 10,
  });
});

/* ---------------------------------------------------------------- */
/*  Projects                                                         */
/* ---------------------------------------------------------------- */

/** Wrap plain paragraphs as Portable Text blocks. */
const toBlocks = (paragraphs: string[], prefix: string) =>
  paragraphs.map((text, i) => ({
    _type: "block",
    _key: `${prefix}${i}`,
    style: "normal",
    markDefs: [],
    children: [{ _type: "span", _key: `${prefix}${i}s`, text, marks: [] }],
  }));

// Fixed timestamp: the seed must be deterministic so re-running doesn't
// reshuffle ordering. Adjust per project in the Studio once real dates exist.
const SEED_PUBLISHED_AT = "2026-01-01T00:00:00.000Z";

PROJECTS.forEach((p, i) => {
  docs.push({
    _id: `project-${p.slug}`,
    _type: "project",
    title: p.title,
    slug: slug(p.slug),
    client: p.client,
    industry: p.industry,
    segments: p.segments,
    // General location only — never a street address.
    location: p.location,
    summary: p.summary,
    challenge: toBlocks(p.challenge, `c${i}`),
    solution: toBlocks(p.solution, `s${i}`),
    equipment: p.equipment,
    featured: p.featured ? "featured" : "standard",
    publishedAt: SEED_PUBLISHED_AT,
    order: (i + 1) * 10,
    // Photography that exists gets uploaded so the client can replace it in
    // the Studio. Projects still awaiting a shoot (Lincoln County Fair) are
    // simply left without, and the page falls back as before.
    heroImage: imageAssetIfPresent(p.image, `${p.client} — project photograph`),
    gallery: (p.gallery ?? [])
      .map((g, gi) =>
        imageAssetIfPresent(g, `${p.client} — project photograph ${gi + 1}`),
      )
      .filter(Boolean)
      .map((img, gi) => ({ ...(img as object), _key: `g${i}-${gi}` })),
  });
});

/* ---------------------------------------------------------------- */
/*  Pricing plans                                                    */
/* ---------------------------------------------------------------- */
const PLANS = [
  {
    slug: "core-protection",
    name: "Core Protection",
    price: 49.99,
    description:
      "Monitored alarm and life-safety protection for homes and small businesses.",
    features: [
      "Alarm system",
      "24/7 professional monitoring",
      "Remote app access",
      "Smart device control",
      "24/7 smoke detection",
      "24/7 carbon monoxide detection",
      "Service plan",
    ],
    featured: "standard",
    ctaLabel: "Get started",
  },
  {
    slug: "pro-protection",
    name: "Pro Protection",
    price: 59.99,
    description: "Security + Video. Complete Protection.",
    features: [
      "Everything in Core Protection",
      "Doorbell camera",
      "Wi-Fi cameras",
      "Active deterrence",
      "Cloud recording",
      "24/7 on-device recording",
    ],
    featured: "featured",
    ctaLabel: "Get started",
  },
  {
    slug: "business",
    name: "Business",
    price: undefined,
    description:
      "Custom-designed systems for commercial, industrial, and government facilities.",
    features: [
      "Everything in Pro Protection",
      "Access control & credentialing",
      "Unlimited commercial-grade cameras",
      "Structured cabling & fiber",
      "NDAA/TAA-compliant equipment available",
      "Dedicated account manager",
    ],
    featured: "standard",
    ctaLabel: "Request a design",
  },
];

PLANS.forEach((plan, i) => {
  docs.push({
    _id: `plan-${plan.slug}`,
    _type: "plan",
    name: plan.name,
    slug: slug(plan.slug),
    ...(plan.price !== undefined && { price: plan.price, period: "/mo" }),
    description: plan.description,
    features: plan.features,
    featured: plan.featured,
    ctaLabel: plan.ctaLabel,
    order: (i + 1) * 10,
  });
});

/* ---------------------------------------------------------------- */
/*  Monitoring-network stats (Becklar)                               */
/* ---------------------------------------------------------------- */
const STATS = [
  ["9.4s", "Average alarm response time"],
  ["2.5M+", "Subscribers monitored"],
  ["6", "Monitoring stations across North America"],
  ["40+", "Years of monitoring experience"],
  ["865M+", "Signals received"],
  ["22K+", "Alarm events handled per day"],
  ["UL", "Certified, fully redundant infrastructure"],
  ["24/7", "Professional monitoring, every day"],
];

STATS.forEach(([value, label], i) => {
  docs.push({
    _id: `stat-${i + 1}`,
    _type: "stat",
    value,
    label,
    order: (i + 1) * 10,
  });
});

/* ---------------------------------------------------------------- */
/*  Site-wide FAQs                                                   */
/* ---------------------------------------------------------------- */
const FAQS: [string, string, string][] = [
  [
    "How fast is your monitoring response?",
    "Reliant customers are backed by the Becklar professional monitoring network, which averages a 9.4-second response time across six interconnected, UL-certified monitoring stations in North America. Signals are assessed and dispatched around the clock, every day of the year.",
    "Monitoring",
  ],
  [
    "Does Reliant offer 24/7 emergency service or technical support?",
    "What runs 24/7 is professional monitoring — your alarm, smoke, and carbon-monoxide signals are watched and dispatched at any hour. Service calls and technical support are handled during regular business hours, and we schedule urgent service as quickly as we can.",
    "Monitoring",
  ],
  [
    "Do I need to sign a contract?",
    "Monitored plans typically start with a 36-month monitoring agreement, which is what keeps the monthly rate where it is. Month-to-month options are available in certain situations — tell us about your project and we'll lay out the choices before you commit.",
    "Billing",
  ],
  [
    "Do you only work on homes, or commercial projects too?",
    "Both. Reliant runs everything from single-family alarm systems to large commercial, industrial, and government projects — including video surveillance, access control, structured cabling and fiber, and audio/video. The same local team handles all of it.",
    "General",
  ],
  [
    "Can I keep my existing equipment?",
    "In many cases, yes. During your free assessment we audit the current hardware and recommend what's worth reusing versus replacing, rather than defaulting to a full rip-and-replace.",
    "Installation",
  ],
  [
    "Are you tied to one manufacturer?",
    "No. Reliant isn't locked into a single manufacturer or proprietary platform, so we design around what the site actually needs — including NDAA/TAA-compliant equipment when a project requires it.",
    "General",
  ],
];

FAQS.forEach(([question, answer, category], i) => {
  docs.push({
    _id: `faq-${i + 1}`,
    _type: "faq",
    question,
    answer,
    category,
    order: (i + 1) * 10,
  });
});

/* ---------------------------------------------------------------- */
/*  Blog: author, categories, posts                                  */
/*                                                                   */
/*  Carried over from the previous WordPress site. Seeding them puts */
/*  the posts in the Studio so they can be edited, re-categorised, or */
/*  given cover images — which the repo fallback can't offer.        */
/* ---------------------------------------------------------------- */

/** Portable Text block from a plain string. */
const block = (text: string, style: "normal" | "h2" | "h3" = "normal", key = "") => ({
  _type: "block",
  _key: key,
  style,
  markDefs: [],
  children: [{ _type: "span", _key: `${key}s`, text, marks: [] }],
});

const listItem = (text: string, key: string) => ({
  ...block(text, "normal", key),
  listItem: "bullet",
  level: 1,
});

const AUTHOR_ID = "author-mahaboob-pasha-mohammad";
docs.push({
  _id: AUTHOR_ID,
  _type: "author",
  name: "Mahaboob Pasha Mohammad",
  slug: slug("mahaboob-pasha-mohammad"),
});

const categoryId = (title: string) =>
  `category-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;

for (const title of POST_CATEGORIES) {
  docs.push({
    _id: categoryId(title),
    _type: "category",
    title,
    slug: slug(title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")),
  });
}

for (const post of POSTS) {
  docs.push({
    _id: `post-${post.slug}`,
    _type: "post",
    title: post.title,
    slug: slug(post.slug),
    ...(post.seoTitle ? { seoTitle: post.seoTitle } : {}),
    excerpt: post.excerpt,
    publishedAt: post.publishedAt,
    author: { _type: "reference", _ref: AUTHOR_ID },
    categories: [
      {
        _type: "reference",
        _key: "c0",
        _ref: categoryId(post.category),
      },
    ],
    body: post.body.map((b, i) =>
      b.kind === "li"
        ? listItem(b.text, `b${i}`)
        : block(b.text, b.kind === "p" ? "normal" : b.kind, `b${i}`),
    ),
  });
}

/* ---------------------------------------------------------------- */
/*  Service area pages                                               */
/*                                                                   */
/*  Seeded with the shared template already filled in, so the owner  */
/*  can edit any single city's copy without touching the others.     */
/* ---------------------------------------------------------------- */
for (const loc of LOCATIONS) {
  const copy = locationCopy(loc);
  docs.push({
    _id: `location-${loc.slug}`,
    _type: "location",
    city: loc.city,
    slug: slug(loc.slug),
    heading: copy.heading,
    intro: copy.intro.map((t, i) => block(t, "normal", `i${i}`)),
    body: [
      ...copy.sectionBody.map((t, i) => block(t, "normal", `s${i}`)),
    ],
    metaTitle: copy.metaTitle,
    metaDescription: copy.metaDescription,
  });
}

/* ---------------------------------------------------------------- */
/*  Policy pages                                                     */
/* ---------------------------------------------------------------- */
for (const page of LEGAL_PAGES) {
  docs.push({
    _id: `legal-${page.slug}`,
    _type: "legalPage",
    title: page.title,
    slug: slug(page.slug),
    intro: page.intro,
    updatedAt: page.updatedAt,
    body: page.body.map((t, i) => block(t, "normal", `p${i}`)),
  });
}

/* ---------------------------------------------------------------- */
/*  Site settings                                                    */
/*                                                                   */
/*  Every value below is verified:                                   */
/*   • phone, email, hours, locality — Reliant's live site footer     */
/*   • googleReviewsUrl — resolves (200) to the real Google Maps      */
/*     place for the business                                        */
/*   • bbbUrl — confirmed profile listing secure-reliant.com,         */
/*     A+ rated, accredited 12 Oct 2023                              */
/*   • Facebook / Yelp — published by Reliant on their own site       */
/*  No rating, review count, or founding date is asserted anywhere.   */
/* ---------------------------------------------------------------- */
docs.push({
  _id: "siteSettings",
  _type: "siteSettings",
  title: "Reliant Security",
  tagline:
    "Locally owned security and low-voltage integration — residential, commercial, industrial, and government — backed by 24/7 professional monitoring.",
  phone: "(636) 294-5645",
  email: "customercare@secure-reliant.com",
  address: "O'Fallon, MO",
  hours: "Mon – Sun: 9:00 AM – 9:00 PM",
  googleReviewsUrl: "https://g.page/r/CUCP_yQyCYQTEBM/review",
  bbbUrl:
    "https://www.bbb.org/us/mo/cottleville/profile/smart-home-security/reliant-llc-0734-1000040816",
  angiesListUrl:
    "https://www.angi.com/companylist/us/mo/ofallon/reliant-llc-reviews-1.htm",
  social: [
    {
      _type: "socialLink",
      _key: "s0",
      platform: "Facebook",
      url: "https://www.facebook.com/reliantllc",
    },
  ],
});

/* ---------------------------------------------------------------- */
/*  Page copy singletons                                             */
/*                                                                   */
/*  Seeded with exactly the wording the components already render,   */
/*  so opening the Studio shows the live site rather than a set of    */
/*  empty fields — and editing one line doesn't blank the rest.       */
/* ---------------------------------------------------------------- */

const cards = (items: typeof HOME_CAPABILITIES, prefix: string) =>
  items.map((c, i) => ({
    _type: "iconCard",
    _key: `${prefix}${i}`,
    title: c.title,
    description: c.description,
    iconKey: c.iconKey,
    ...(c.href ? { href: c.href } : {}),
  }));

docs.push({
  _id: "homePage",
  _type: "homePage",
  eyebrow: HOME_DEFAULTS.hero.eyebrow,
  title: HOME_DEFAULTS.hero.title,
  subtitle: HOME_DEFAULTS.hero.subtitle,
  primaryCta: { _type: "ctaLink", ...HOME_DEFAULTS.hero.primaryCta },
  secondaryCta: { _type: "ctaLink", ...HOME_DEFAULTS.hero.secondaryCta },
  capabilities: {
    heading: HOME_DEFAULTS.capabilities.heading,
    subheading: HOME_DEFAULTS.capabilities.subheading,
    items: cards(HOME_CAPABILITIES, "cap"),
  },
  serviceDirectory: { _type: "sectionHeading", ...HOME_DEFAULTS.serviceDirectory },
  industries: { _type: "sectionHeading", ...HOME_DEFAULTS.industries },
  projects: { _type: "sectionHeading", ...HOME_DEFAULTS.projects },
  testimonials: { _type: "sectionHeading", ...HOME_DEFAULTS.testimonials },
  serviceArea: { _type: "sectionHeading", ...HOME_DEFAULTS.serviceArea },
});

docs.push({
  _id: "aboutPage",
  _type: "aboutPage",
  badge: ABOUT_DEFAULTS.badge,
  heading: ABOUT_DEFAULTS.heading,
  differentiators: {
    heading: ABOUT_DEFAULTS.differentiators.heading,
    subheading: ABOUT_DEFAULTS.differentiators.subheading,
    items: cards(ABOUT_DIFFERENTIATORS, "d"),
  },
  customers: {
    heading: ABOUT_DEFAULTS.customers.heading,
    subheading: ABOUT_DEFAULTS.customers.subheading,
    items: cards(ABOUT_CUSTOMERS, "c"),
  },
  introImage: imageAsset(PHOTOS.ownerPortrait.src, PHOTOS.ownerPortrait.alt),
  // ownerNote is deliberately left empty: the component's default copy is
  // generic on purpose, and a seeded signature would look approved when it
  // hasn't been. Reliant should write this one themselves.
});

docs.push({
  _id: "servicesPage",
  _type: "servicesPage",
  ...SERVICES_PAGE_DEFAULTS,
  heroImage: imageAsset(PHOTOS.truckWide.src, PHOTOS.truckWide.alt),
});

docs.push({
  _id: "navigation",
  _type: "navigation",
  ctaLabel: NAV_DEFAULTS.ctaLabel,
  primary: NAV_DEFAULTS.primary.map((item, i) => ({
    _type: "navItem",
    _key: `n${i}`,
    label: item.label,
    href: item.href,
    ...(item.children?.length
      ? {
          children: item.children.map((c, j) => ({
            _type: "navChild",
            _key: `n${i}c${j}`,
            label: c.label,
            href: c.href,
            desc: c.desc,
            iconKey: c.iconKey,
          })),
        }
      : {}),
  })),
  footerLinks: NAV_DEFAULTS.footerLinks.map((l, i) => ({
    _type: "ctaLink",
    _key: `f${i}`,
    ...l,
  })),
});

/* ---------------------------------------------------------------- */
/*  Write NDJSON                                                     */
/* ---------------------------------------------------------------- */
const outPath = join(dirname(fileURLToPath(import.meta.url)), "seed.ndjson");
writeFileSync(outPath, docs.map((d) => JSON.stringify(d)).join("\n") + "\n");

const counts = docs.reduce<Record<string, number>>((acc, d) => {
  acc[d._type] = (acc[d._type] ?? 0) + 1;
  return acc;
}, {});

console.log(`Wrote ${docs.length} documents to ${outPath}`);
console.table(counts);
