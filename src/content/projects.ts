import type { IndustrySegment } from "@/content/industries";

/**
 * Project portfolio — the built-in default for the /projects index and the
 * /projects/[slug] detail pages. Sanity `project` documents override these
 * by slug once they exist.
 *
 * ── TWO RULES THAT ARE NOT STYLE PREFERENCES ──────────────────────────────
 *
 * 1. NEVER publish a customer's street address. The client asked for this
 *    explicitly. `location` is city + state only. Hero imagery should be an
 *    aerial/exterior view or an on-site photo — not anything that reads as a
 *    mailing address or signage with a street number.
 *
 * 2. Anything marked `DRAFT` below is placeholder narrative written to give
 *    the layout real shape. It is NOT confirmed project detail. Reliant must
 *    review and correct the challenge/solution/equipment copy before this
 *    goes live — these are real named customers, and publishing invented
 *    specifics about their sites would be worse than publishing nothing.
 *
 * Photos: drop files at the exact `image` / `gallery` paths listed here and
 * they appear automatically. Missing files degrade to a styled placeholder,
 * so the page never looks broken while you're still gathering media.
 */

export type TaxonomyProject = {
  slug: string;
  title: string;
  client: string;
  industry: string;
  /** City + state only. Never a street address. */
  location: string;
  segments: IndustrySegment[];
  summary: string;
  /** Local path under /public. Optional until photography lands. */
  image?: string;
  gallery?: string[];
  /** What the customer needed. DRAFT until Reliant confirms. */
  challenge: string[];
  /** What Reliant delivered. DRAFT until Reliant confirms. */
  solution: string[];
  /** Headline systems involved. DRAFT until Reliant confirms. */
  equipment: string[];
  featured?: boolean;
};

/** Shared draft copy for the galvanizing-plant projects. */
const GALVANIZING_CHALLENGE = [
  "Hot-dip galvanizing plants are punishing environments for security hardware. Kettle heat, acid vapour from the pickling line, airborne zinc dust, constant overhead crane movement, and wide-open bay doors combine to destroy equipment that was specified for an ordinary commercial building.",
  "The site also runs well beyond its buildings: material laydown yards, trailer parking, and finished-product storage sit outdoors across a large footprint, with shift work that leaves few genuinely quiet hours.",
];

const GALVANIZING_SOLUTION = [
  "Reliant designed and installed site-wide video surveillance built for the conditions — cameras and enclosures specified for the heat, corrosion, and particulate load of an active galvanizing operation, positioned to cover the kettle and production areas, dock and bay doors, yards, and site approaches.",
  "Recording was sized for retention that is actually useful when an incident surfaces days later, and the system was tied back to a network backbone capable of carrying the camera load across the separated buildings on site.",
];

const GALVANIZING_EQUIPMENT = [
  "Industrial-rated IP video surveillance",
  "Environmental enclosures & mounts",
  "Network video recording with extended retention",
  "Structured cabling & network backbone",
  "Remote live view and playback",
];

export const PROJECTS: TaxonomyProject[] = [
  {
    slug: "big-bend-galvanizing",
    title: "Site-wide video surveillance for a hot-dip galvanizing plant",
    client: "Big Bend Galvanizing",
    industry: "Industrial & Manufacturing",
    location: "Trenton, Tennessee",
    segments: ["industrial"],
    summary:
      "Industrial-grade camera coverage across production, dock, and yard areas at an active galvanizing facility.",
    image: "/Images/Projects/big-bend-galvanizing/hero.jpg",
    gallery: [
      "/Images/Projects/big-bend-galvanizing/01.jpg",
      "/Images/Projects/big-bend-galvanizing/02.jpg",
      "/Images/Projects/big-bend-galvanizing/03.jpg",
    ],
    challenge: GALVANIZING_CHALLENGE,
    solution: GALVANIZING_SOLUTION,
    equipment: GALVANIZING_EQUIPMENT,
    featured: true,
  },
  {
    slug: "universal-galvanizing",
    title: "Production and yard surveillance for a galvanizing operation",
    client: "Universal Galvanizing",
    industry: "Industrial & Manufacturing",
    location: "Wright City, Missouri",
    segments: ["industrial"],
    summary:
      "Full-site video coverage spanning the production floor, loading areas, and outdoor material storage.",
    image: "/Images/Projects/universal-galvanizing/hero.jpg",
    gallery: [
      "/Images/Projects/universal-galvanizing/01.jpg",
      "/Images/Projects/universal-galvanizing/02.jpg",
      "/Images/Projects/universal-galvanizing/03.jpg",
    ],
    challenge: GALVANIZING_CHALLENGE,
    solution: GALVANIZING_SOLUTION,
    equipment: GALVANIZING_EQUIPMENT,
    featured: true,
  },
  {
    slug: "indiana-galvanizing",
    title: "Industrial surveillance across a multi-building galvanizing site",
    client: "Indiana Galvanizing",
    industry: "Industrial & Manufacturing",
    location: "Middlebury, Indiana",
    segments: ["industrial"],
    summary:
      "Camera coverage and supporting network infrastructure connecting separated buildings on one industrial campus.",
    image: "/Images/Projects/indiana-galvanizing/hero.jpg",
    gallery: [
      "/Images/Projects/indiana-galvanizing/01.jpg",
      "/Images/Projects/indiana-galvanizing/02.jpg",
      "/Images/Projects/indiana-galvanizing/03.jpg",
    ],
    challenge: GALVANIZING_CHALLENGE,
    solution: GALVANIZING_SOLUTION,
    equipment: GALVANIZING_EQUIPMENT,
    featured: true,
  },
  {
    slug: "bob-monnig-industries",
    title: "Video surveillance for a heavy industrial facility",
    client: "Bob Monnig Industries",
    industry: "Industrial & Manufacturing",
    location: "Glasgow, Missouri",
    segments: ["industrial"],
    summary:
      "Site surveillance covering production, equipment storage, and site approaches at a heavy industrial operation.",
    image: "/Images/Projects/bob-monnig-industries/hero.jpg",
    gallery: [
      "/Images/Projects/bob-monnig-industries/01.jpg",
      "/Images/Projects/bob-monnig-industries/02.jpg",
      "/Images/Projects/bob-monnig-industries/03.jpg",
    ],
    challenge: GALVANIZING_CHALLENGE,
    solution: GALVANIZING_SOLUTION,
    equipment: GALVANIZING_EQUIPMENT,
  },
  {
    slug: "crossroads-galvanizing",
    title: "Perimeter and production surveillance for a galvanizing plant",
    client: "Crossroads Galvanizing",
    industry: "Industrial & Manufacturing",
    location: "Lafayette, Indiana",
    segments: ["industrial"],
    summary:
      "Wide-area camera coverage across the plant perimeter, yard, and production areas.",
    image: "/Images/Projects/crossroads-galvanizing/hero.jpg",
    gallery: [
      "/Images/Projects/crossroads-galvanizing/01.jpg",
      "/Images/Projects/crossroads-galvanizing/02.jpg",
      "/Images/Projects/crossroads-galvanizing/03.jpg",
    ],
    challenge: GALVANIZING_CHALLENGE,
    solution: GALVANIZING_SOLUTION,
    equipment: GALVANIZING_EQUIPMENT,
  },
];

export const ALL_PROJECT_SLUGS: string[] = PROJECTS.map((p) => p.slug);

export function findProjectBySlug(slug: string): TaxonomyProject | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}
