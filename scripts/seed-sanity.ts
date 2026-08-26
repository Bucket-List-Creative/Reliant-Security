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
 *   • siteSettings — phone, email, and address aren't known yet. Create this
 *     singleton in the Studio so nothing gets published as a placeholder.
 */
import { writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { SERVICE_CATEGORIES } from "../src/content/services";
import { INDUSTRIES } from "../src/content/industries";
import { PROJECTS } from "../src/content/projects";

type Doc = Record<string, unknown> & { _id: string; _type: string };

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
    icon: ind.icon,
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
