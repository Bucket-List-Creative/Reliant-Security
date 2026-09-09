/**
 * Local "areas we serve" pages.
 *
 * Every city shares one template — the copy is identical apart from the city
 * name — which mirrors how the previous WordPress site handled these pages and
 * keeps the URLs (`/st-charles-mo`, `/wentzville-mo`, …) intact so their search
 * rankings carry over to this build.
 *
 * The wording below is Reliant's own, lifted from the live site. `{city}` is
 * substituted at render time; nothing else varies. A `location` document in
 * Sanity can override the headline, intro, and body for any single city when
 * the owner wants one page to read differently — see `LOCATIONS_QUERY`.
 */

export type Location = {
  /** URL segment — matches the previous site exactly. */
  slug: string;
  /** City name as it should read in copy, e.g. "St. Charles". */
  city: string;
  /** Two-letter state code. Every current area is Missouri. */
  state: string;
  county: string;
  lat: number;
  lng: number;
};

export const LOCATIONS: Location[] = [
  { slug: "st-louis-mo", city: "St. Louis", state: "MO", county: "St. Louis City", lat: 38.627, lng: -90.1994 },
  { slug: "st-charles-mo", city: "St. Charles", state: "MO", county: "St. Charles County", lat: 38.7881, lng: -90.4974 },
  { slug: "chesterfield-mo", city: "Chesterfield", state: "MO", county: "St. Louis County", lat: 38.6631, lng: -90.5771 },
  { slug: "st-peters-mo", city: "St. Peters", state: "MO", county: "St. Charles County", lat: 38.7875, lng: -90.6298 },
  { slug: "wentzville-mo", city: "Wentzville", state: "MO", county: "St. Charles County", lat: 38.8114, lng: -90.8529 },
  { slug: "wildwood-mo", city: "Wildwood", state: "MO", county: "St. Louis County", lat: 38.5828, lng: -90.6629 },
  { slug: "troy-mo", city: "Troy", state: "MO", county: "Lincoln County", lat: 38.9795, lng: -90.9807 },
  { slug: "warrenton-mo", city: "Warrenton", state: "MO", county: "Warren County", lat: 38.8114, lng: -91.1416 },
  { slug: "florissant-mo", city: "Florissant", state: "MO", county: "St. Louis County", lat: 38.7892, lng: -90.3223 },
  { slug: "washington-mo", city: "Washington", state: "MO", county: "Franklin County", lat: 38.5581, lng: -91.0121 },
  { slug: "olivette-mo", city: "Olivette", state: "MO", county: "St. Louis County", lat: 38.6656, lng: -90.3762 },
  { slug: "dardenne-prairie-mo", city: "Dardenne Prairie", state: "MO", county: "St. Charles County", lat: 38.7695, lng: -90.729 },
  { slug: "moscow-mills-mo", city: "Moscow Mills", state: "MO", county: "Lincoln County", lat: 38.9473, lng: -90.9182 },
  { slug: "lake-st-louis-mo", city: "Lake St. Louis", state: "MO", county: "St. Charles County", lat: 38.785, lng: -90.7935 },
  { slug: "eureka-mo", city: "Eureka", state: "MO", county: "St. Louis County", lat: 38.5023, lng: -90.6263 },
  { slug: "festus-mo", city: "Festus", state: "MO", county: "Jefferson County", lat: 38.2206, lng: -90.3962 },
  { slug: "affton-mo", city: "Affton", state: "MO", county: "St. Louis County", lat: 38.5509, lng: -90.3312 },
  { slug: "concord-mo", city: "Concord", state: "MO", county: "St. Louis County", lat: 38.5195, lng: -90.354 },
  { slug: "union-mo", city: "Union", state: "MO", county: "Franklin County", lat: 38.4348, lng: -91.0085 },
  { slug: "ballwin-mo", city: "Ballwin", state: "MO", county: "St. Louis County", lat: 38.595, lng: -90.5462 },
  { slug: "mehlville-mo", city: "Mehlville", state: "MO", county: "St. Louis County", lat: 38.5039, lng: -90.3231 },
  { slug: "hazelwood-mo", city: "Hazelwood", state: "MO", county: "St. Louis County", lat: 38.7714, lng: -90.3712 },
  { slug: "manchester-mo", city: "Manchester", state: "MO", county: "St. Louis County", lat: 38.5973, lng: -90.5096 },
  { slug: "maryland-heights-mo", city: "Maryland Heights", state: "MO", county: "St. Louis County", lat: 38.7131, lng: -90.4298 },
  { slug: "webster-groves-mo", city: "Webster Groves", state: "MO", county: "St. Louis County", lat: 38.5926, lng: -90.3573 },
  { slug: "clayton-mo", city: "Clayton", state: "MO", county: "St. Louis County", lat: 38.6426, lng: -90.3237 },
  { slug: "spanish-lake-mo", city: "Spanish Lake", state: "MO", county: "St. Louis County", lat: 38.7889, lng: -90.2154 },
  { slug: "brentwood-mo", city: "Brentwood", state: "MO", county: "St. Louis County", lat: 38.6176, lng: -90.3487 },
  { slug: "creve-coeur-mo", city: "Creve Coeur", state: "MO", county: "St. Louis County", lat: 38.6609, lng: -90.4229 },
  { slug: "defiance-mo", city: "Defiance", state: "MO", county: "St. Charles County", lat: 38.6472, lng: -90.7871 },
];

export const LOCATION_SLUGS = LOCATIONS.map((l) => l.slug);

export function findLocation(slug: string): Location | undefined {
  return LOCATIONS.find((l) => l.slug === slug);
}

/** "St. Charles" + "MO" → "St. Charles, MO" */
export function locationLabel(l: Location): string {
  return `${l.city}, ${l.state}`;
}

/* ------------------------------------------------------------------ */
/*  The shared template                                                */
/* ------------------------------------------------------------------ */

/** Services listed on every location page, matching the previous site. */
export const LOCATION_SERVICES: { label: string; slug: string }[] = [
  { label: "Security Alarm", slug: "security-alarm" },
  { label: "Smart Home & Business Automation", slug: "smart-automation" },
  { label: "Wireless Video", slug: "wireless-video" },
  { label: "Hardwired / Surveillance Video", slug: "cctv-surveillance" },
  { label: "Wellness & Safety Monitoring", slug: "wellness-safety-monitoring" },
];

export type LocationCopy = {
  heading: string;
  intro: string[];
  servicesLead: string;
  mission: string;
  sectionHeading: string;
  sectionBody: string[];
  closingHeading: string;
  closingBody: string;
  metaTitle: string;
  metaDescription: string;
};

/**
 * Build the page copy for a city. Kept as one function so every location page
 * stays word-for-word identical apart from the city name — the whole point of
 * the template.
 */
export function locationCopy(l: Location): LocationCopy {
  const place = `${l.city}, ${l.state}`;

  return {
    heading: `Secure and Simplify Your Life With Our Security System Company in ${place}`,
    intro: [
      `In today's world, the security of our homes and businesses in ${place}, is more important than ever. At Reliant, LLC, a trusted security system company, we recognize the unique challenges our community faces, from the need to protect against intruders to the desire for smart, automated living and working environments.`,
    ],
    servicesLead: "Our comprehensive services include:",
    mission:
      "Our mission is to provide peace of mind through reliable security system installation, smart home installation, doorbell camera installation, hardwired security camera solutions, and attentive security monitoring services. We understand the importance of feeling safe and connected, whether it's in the comfort of your home or the efficiency of your workplace.",
    sectionHeading: "Elevate Your Security Standards Now",
    sectionBody: [
      `Living in ${place}, brings its own set of challenges and advantages. As a community with its own history and character, ensuring the safety of our properties and loved ones is crucial. That's where our services come into play, offering technology tailored to meet the specific needs of our clients. With free estimates we strive to make our services accessible to everyone in our community.`,
      `In ${place}, the need for robust security measures has never been more critical. Embracing the latest in security technology not only serves as a shield protecting your valued assets but also offers real convenience, changing the way you interact with your living or workspaces. At Reliant, LLC, we're not just another security system company; we're your partners in integrating solutions that improve both the safety and comfort of your daily environment.`,
      "Our team is committed to offering solutions that fit your lifestyle, ensuring your home or business is equipped with technology that is advanced yet straightforward to use. From remote property monitoring that keeps you connected no matter where you are, to smart automation of home or business operations that streamlines your day-to-day tasks, we provide the tools you need to navigate modern life securely.",
      `With Reliant, LLC, you're choosing a security system company that values the specifics of life in ${l.city} as much as you do. From the initial consultation and system installation to ongoing support and round-the-clock monitoring, we take a comprehensive, tailored approach to your security and automation needs.`,
    ],
    closingHeading: "Stay Protected 24/7",
    closingBody:
      "Discover a sense of safety that comes with professional security solutions.",
    metaTitle: `Security System Company ${place}`,
    metaDescription: `Reliant Security installs and monitors alarm systems, cameras, smart automation, and access control for homes and businesses in ${place}. Locally owned, BBB A+ accredited, with free estimates.`,
  };
}

/* ------------------------------------------------------------------ */
/*  Proximity                                                          */
/* ------------------------------------------------------------------ */

/** Great-circle distance in miles between two coordinates. */
function distanceMiles(a: Location, b: Location): number {
  const R = 3958.8;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/**
 * The service areas closest to a given city, nearest first.
 *
 * This exists to make the location pages genuinely differ from one another.
 * Google's spam policy treats "substantially similar pages" targeted at
 * different cities as doorway abuse, and a page whose only variable is the
 * city name is exactly that. Real proximity data means each page links to a
 * different, actually-relevant set of neighbouring communities — and gives its
 * structured data a distinct `areaServed`.
 *
 * It is a partial mitigation, not a cure: genuinely local copy is still the
 * thing that makes these pages defensible. See the `location` document in
 * Sanity, where per-city intro and body copy can be written.
 */
export function nearestLocations(origin: Location, count = 6): Location[] {
  return LOCATIONS.filter((l) => l.slug !== origin.slug)
    .map((l) => ({ l, d: distanceMiles(origin, l) }))
    .sort((a, b) => a.d - b.d)
    .slice(0, count)
    .map(({ l }) => l);
}

/** Rounded straight-line distance from Reliant's O'Fallon base. */
export const HQ: Location = {
  slug: "ofallon-mo",
  city: "O'Fallon",
  state: "MO",
  county: "St. Charles County",
  lat: 38.8106,
  lng: -90.6998,
};

export function milesFromHq(l: Location): number {
  return Math.round(distanceMiles(HQ, l));
}
