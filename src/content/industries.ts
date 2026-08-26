import type { ServiceIconKey } from "@/components/ui/ServiceIcon";

/**
 * Industry taxonomy — the single source of truth for the Industries index,
 * the /industries/[slug] detail pages, and the navbar dropdown.
 *
 * Reliant is a full-service security and low-voltage contractor: the range
 * deliberately runs from a single-family alarm system all the way through
 * custom homes, multi-family, commercial, industrial, and government/DoD
 * facilities. Keep that spread intact when editing — the whole point of this
 * list is that the site must not read as residential-only.
 *
 * Copy here is the built-in default. When matching `industry` documents exist
 * in Sanity (matched by `slug`), the pages prefer the CMS values.
 */

export type IndustrySegment =
  | "residential"
  | "commercial"
  | "industrial"
  | "government";

export type IndustryPoint = { title: string; description: string };

export type TaxonomyIndustry = {
  slug: string;
  name: string;
  /** Line-icon key from the shared set — never an emoji. */
  iconKey: ServiceIconKey;
  /** Card/section description and default meta description. */
  summary: string;
  /** An industry can legitimately belong to more than one segment. */
  segments: IndustrySegment[];
  /** 1–2 paragraphs of body copy for the detail page. */
  overview: string[];
  /** The risks this sector actually faces. */
  threats: IndustryPoint[];
  /** How Reliant addresses them. */
  solutions: IndustryPoint[];
  /** Slugs from `services.ts` most relevant to this sector. */
  serviceSlugs: string[];
  featured?: boolean;
};

export const SEGMENT_LABELS: Record<IndustrySegment, string> = {
  residential: "Residential",
  commercial: "Commercial",
  industrial: "Industrial",
  government: "Government",
};

export const INDUSTRIES: TaxonomyIndustry[] = [
  /* ---------------- Residential ---------------- */
  {
    slug: "residential",
    name: "Residential",
    iconKey: "home",
    segments: ["residential"],
    summary:
      "Monitored alarms, cameras, smart locks, and automation that keep a household safe day and night.",
    overview: [
      "Residential security is where most families start, and it still has to be done properly. Reliant designs around the way your home is actually used — the doors everyone comes through, the windows nobody thinks about, and the hours the house sits empty.",
      "Every system is backed by professional monitoring, so smoke, carbon monoxide, and intrusion signals reach a UL-certified central station whether you're asleep upstairs or three states away.",
    ],
    threats: [
      {
        title: "Forced and opportunistic entry",
        description:
          "Most residential break-ins happen through a front, back, or garage door during ordinary daytime hours.",
      },
      {
        title: "Fire, smoke, and carbon monoxide",
        description:
          "An unmonitored detector only helps if somebody is home to hear it.",
      },
      {
        title: "Package and porch theft",
        description:
          "Deliveries left at the door are a routine target, and unmonitored doorbells rarely produce usable identification.",
      },
    ],
    solutions: [
      {
        title: "Layered intrusion detection",
        description:
          "Entry, motion, and glass-break sensors catch an intrusion at the perimeter and again inside.",
      },
      {
        title: "24/7 professional monitoring",
        description:
          "Alarm, smoke, and CO signals are verified and dispatched by the central station around the clock.",
      },
      {
        title: "Video and smart control",
        description:
          "Doorbell and Wi-Fi cameras with app control, smart locks, and automation you can run from anywhere.",
      },
    ],
    serviceSlugs: [
      "security-alarm",
      "interactive-alarm",
      "wireless-video",
      "wellness-safety-monitoring",
    ],
    featured: true,
  },
  {
    slug: "custom-homes",
    name: "Custom Homes",
    iconKey: "custom-home",
    segments: ["residential"],
    summary:
      "Fully integrated security, surveillance, networking, structured cabling, audio/video, and automation for high-end and new-construction homes.",
    overview: [
      "A custom home is a construction project before it is a security project. Getting Reliant involved during framing means the cabling, camera locations, rack space, and network backbone are designed in — not retrofitted through finished walls afterward.",
      "We coordinate with builders, architects, and electricians to deliver one integrated system: surveillance, access, structured cabling, distributed audio/video, and whole-home automation that all answer to a single app.",
    ],
    threats: [
      {
        title: "Infrastructure decided too late",
        description:
          "Cabling and device locations fixed after drywall force compromises that are expensive or impossible to undo.",
      },
      {
        title: "Large, complex perimeters",
        description:
          "Long approaches, outbuildings, gates, and multiple elevations leave gaps a packaged system won't cover.",
      },
      {
        title: "Too many disconnected apps",
        description:
          "Separately-purchased subsystems leave the homeowner juggling half a dozen interfaces that don't talk to each other.",
      },
    ],
    solutions: [
      {
        title: "Pre-construction design",
        description:
          "Cable pathways, rack space, camera sightlines, and network capacity engineered before the walls close.",
      },
      {
        title: "One integrated platform",
        description:
          "Security, video, access, climate, lighting, and audio/video unified under a single control interface.",
      },
      {
        title: "Builder-grade coordination",
        description:
          "We work to the construction schedule alongside the other trades and hand off a documented, labeled system.",
      },
    ],
    serviceSlugs: [
      "network-cabling",
      "smart-automation",
      "audio-video",
      "cctv-surveillance",
    ],
    featured: true,
  },
  {
    slug: "multi-family",
    name: "Multi-Family",
    iconKey: "multi-family",
    segments: ["residential", "commercial"],
    summary:
      "Access control, intercoms, common-area surveillance, and property-management tools for apartments, condos, and multi-family communities.",
    overview: [
      "Multi-family properties aren't just larger houses. Turnover, shared entrances, amenity spaces, parking structures, and package rooms create access and liability problems that residential equipment was never designed to handle.",
      "Reliant builds systems around the property's operations: credentials that can be issued and revoked at move-in and move-out, intercom entry that works for residents and guests, and camera coverage over the common areas where incidents and disputes actually occur.",
    ],
    threats: [
      {
        title: "Constant resident turnover",
        description:
          "Rekeying locks every time a unit changes hands is slow, costly, and never fully reliable.",
      },
      {
        title: "Tailgating at shared entrances",
        description:
          "Controlled lobby and garage doors are routinely defeated by someone simply following a resident in.",
      },
      {
        title: "Common-area liability",
        description:
          "Incidents in parking structures, laundry rooms, pools, and package rooms turn into disputes without footage.",
      },
    ],
    solutions: [
      {
        title: "Credential-based access",
        description:
          "Fobs and mobile credentials issued and revoked in software — no rekeying at turnover, with a full audit trail.",
      },
      {
        title: "Intercom and gate entry",
        description:
          "Video intercom at lobbies and gates so residents can verify visitors and grant entry remotely.",
      },
      {
        title: "Common-area coverage",
        description:
          "Camera layouts focused on entrances, garages, amenity spaces, and package areas, retained for management review.",
      },
    ],
    serviceSlugs: [
      "access-control",
      "cctv-surveillance",
      "network-cabling",
      "security-alarm",
    ],
  },

  /* ---------------- Commercial ---------------- */
  {
    slug: "commercial-office",
    name: "Commercial & Office",
    iconKey: "building",
    segments: ["commercial"],
    summary:
      "Integrated alarm, surveillance, access control, and network infrastructure for offices, professional buildings, and general commercial facilities.",
    overview: [
      "Offices and professional buildings need security that fits how people actually work — open during business hours, locked down after them, and auditable in between. Reliant designs commercial systems around occupancy, not around a residential template.",
      "Because we also handle the structured cabling, network, and audio/video, the security system doesn't arrive as an island. One team designs the doors, the cameras, the cabling, and the conference rooms, and one team is accountable when something needs attention.",
    ],
    threats: [
      {
        title: "After-hours intrusion",
        description:
          "Empty offices with visible equipment are a standing target outside business hours.",
      },
      {
        title: "Uncontrolled interior access",
        description:
          "Server rooms, records storage, and executive areas often sit behind nothing more than a standard lock.",
      },
      {
        title: "No record of who was where",
        description:
          "Without access logs and video, internal incidents come down to conflicting accounts.",
      },
    ],
    solutions: [
      {
        title: "Scheduled arming and access",
        description:
          "Systems that follow your business hours automatically, with credentials scoped by role, door, and time.",
      },
      {
        title: "Interior zone protection",
        description:
          "Additional detection and controlled access on server rooms, records, and sensitive departments.",
      },
      {
        title: "Unified video and access",
        description:
          "Door events tied to footage so any incident can be reconstructed from one place.",
      },
    ],
    serviceSlugs: [
      "access-control",
      "cctv-surveillance",
      "network-cabling",
      "audio-video",
    ],
    featured: true,
  },
  {
    slug: "industrial-manufacturing",
    name: "Industrial & Manufacturing",
    iconKey: "factory",
    segments: ["industrial", "commercial"],
    summary:
      "Large-site surveillance, perimeter protection, access control, and structured cabling built for plants, production floors, and heavy industrial facilities.",
    overview: [
      "Industrial sites are among the most demanding environments we work in: large perimeters, outdoor yards, heavy equipment, dust, vibration, temperature extremes, and shift work that never really stops. Consumer-grade hardware does not survive there.",
      "Reliant designs and installs industrial systems end to end — hardened cameras across yards and production areas, controlled access to plant and office zones, and the fiber and structured cabling backbone that ties distant buildings into one network. This is a market Reliant actively works in and continues to grow.",
    ],
    threats: [
      {
        title: "Extensive outdoor perimeters",
        description:
          "Yards, laydown areas, and equipment storage sit well outside any building envelope and are hard to observe.",
      },
      {
        title: "Material and equipment loss",
        description:
          "Raw stock, finished product, tooling, and scrap are high-value and frequently targeted.",
      },
      {
        title: "Harsh operating conditions",
        description:
          "Dust, vibration, moisture, and temperature swings destroy hardware that wasn't specified for the environment.",
      },
      {
        title: "Distance between buildings",
        description:
          "Plant, office, scale house, and outbuildings are often too far apart for standard copper runs.",
      },
    ],
    solutions: [
      {
        title: "Wide-area camera coverage",
        description:
          "Industrial-rated cameras across yards, gates, docks, and production areas, with recording sized for real retention.",
      },
      {
        title: "Fiber backbone",
        description:
          "Single- and multi-mode fiber linking separated buildings into one reliable network.",
      },
      {
        title: "Zoned access control",
        description:
          "Credentials that separate plant floor, office, and restricted areas, with a full entry audit trail.",
      },
      {
        title: "Environment-appropriate hardware",
        description:
          "Enclosures, mounts, and pathways specified for the temperature, washdown, and vibration conditions on site.",
      },
    ],
    serviceSlugs: [
      "cctv-surveillance",
      "network-cabling",
      "access-control",
      "security-alarm",
    ],
    featured: true,
  },
  {
    slug: "government-public-sector",
    name: "Government & Public Sector",
    iconKey: "government",
    segments: ["government", "commercial"],
    summary:
      "Surveillance, access control, structured cabling, and fiber infrastructure for Federal, State, Municipal, and Department of Defense projects — with NDAA/TAA-compliant equipment when required.",
    overview: [
      "Government and public-sector work carries requirements that commercial projects don't: sourcing restrictions, documentation, coordination with facility staff, and specifications that must be met exactly as written. Reliant is set up to work within them.",
      "We deliver surveillance, access control, structured cabling, fiber, and supporting infrastructure across Federal, State, Municipal, and Department of Defense facilities. Where a project requires NDAA Section 889 and TAA-compliant equipment, we specify and supply compliant hardware — and because we aren't tied to a single manufacturer, we can build to the compliance requirement rather than around it.",
    ],
    threats: [
      {
        title: "Procurement and sourcing restrictions",
        description:
          "Covered equipment is prohibited outright on many public projects, and non-compliant hardware can fail an installation after the fact.",
      },
      {
        title: "Controlled and restricted areas",
        description:
          "Facilities frequently require graduated access with defensible records of every entry.",
      },
      {
        title: "Specification and documentation burden",
        description:
          "Public work is bid and inspected against written specs, submittals, and as-built documentation.",
      },
      {
        title: "Aging or mixed infrastructure",
        description:
          "Public buildings often run on layered legacy cabling and systems from several past contractors.",
      },
    ],
    solutions: [
      {
        title: "NDAA/TAA-compliant equipment",
        description:
          "Compliant cameras, recorders, and access hardware specified and supplied where a project requires it.",
      },
      {
        title: "Credentialed access control",
        description:
          "Role- and zone-based access with complete, exportable audit trails for restricted areas.",
      },
      {
        title: "Structured cabling and fiber",
        description:
          "Certified Cat6/Cat6A and fiber infrastructure, tested, labeled, and documented to the specification.",
      },
      {
        title: "Spec-driven delivery",
        description:
          "Submittals, testing results, and as-built documentation delivered as part of the project, not after it.",
      },
    ],
    serviceSlugs: [
      "network-cabling",
      "cctv-surveillance",
      "access-control",
      "cyber-security",
    ],
    featured: true,
  },
  {
    slug: "retail",
    name: "Retail",
    iconKey: "store",
    segments: ["commercial"],
    summary:
      "Deter theft, protect staff, and monitor multiple storefronts from a single dashboard.",
    overview: [
      "Retail loses inventory at the shelf, at the register, and at the back door — often to different people for different reasons. Useful retail security has to cover all three without turning the sales floor into a fortress.",
      "Reliant deploys camera coverage at entrances, point of sale, and stockrooms, controls back-of-house access, and gives multi-location operators one interface for every store.",
    ],
    threats: [
      {
        title: "External theft and organized retail crime",
        description:
          "Sales-floor and grab-and-run losses, increasingly coordinated across multiple locations.",
      },
      {
        title: "Internal shrink",
        description:
          "Register, returns, and stockroom losses that inventory counts surface only long after the fact.",
      },
      {
        title: "Staff safety at open and close",
        description:
          "Employees are most exposed during opening, closing, and cash handling.",
      },
    ],
    solutions: [
      {
        title: "Point-of-sale and floor coverage",
        description:
          "Camera placement over registers, entrances, and high-value displays at identification-grade resolution.",
      },
      {
        title: "Back-of-house access control",
        description:
          "Credentialed entry to stockrooms and offices with a record of who opened what and when.",
      },
      {
        title: "Multi-site management",
        description:
          "Every location's cameras, alarms, and access managed from one dashboard.",
      },
    ],
    serviceSlugs: [
      "cctv-surveillance",
      "access-control",
      "security-alarm",
      "interactive-alarm",
    ],
  },
  {
    slug: "warehousing-logistics",
    name: "Warehousing & Logistics",
    iconKey: "warehouse",
    segments: ["commercial", "industrial"],
    summary:
      "Control access, secure inventory, and keep high-traffic distribution facilities covered around the clock.",
    overview: [
      "Distribution facilities move continuously, and every dock door, yard gate, and trailer is a point where inventory can leave unaccounted for. Coverage has to keep up with the traffic rather than sample it.",
      "Reliant secures docks, yards, and storage with camera coverage tied to access events, so a discrepancy can be traced to a specific door, time, and credential.",
    ],
    threats: [
      {
        title: "Dock and yard loss",
        description:
          "High vehicle and personnel traffic makes unaccounted-for movement easy to miss in real time.",
      },
      {
        title: "Uncontrolled facility access",
        description:
          "Drivers, contractors, and temporary staff cycle through constantly, often without managed credentials.",
      },
      {
        title: "Round-the-clock exposure",
        description:
          "Facilities running multiple shifts have no natural closed period when the site is simply secured.",
      },
    ],
    solutions: [
      {
        title: "Dock and yard surveillance",
        description:
          "Coverage of every dock door, gate, and yard lane with retention long enough to investigate discrepancies.",
      },
      {
        title: "Credentialed entry by role",
        description:
          "Separate access for staff, drivers, and contractors, revocable the moment someone leaves.",
      },
      {
        title: "Continuous monitoring",
        description:
          "24/7 professional monitoring covering the hours the facility never actually closes.",
      },
    ],
    serviceSlugs: [
      "cctv-surveillance",
      "access-control",
      "network-cabling",
      "security-alarm",
    ],
  },
  {
    slug: "healthcare",
    name: "Healthcare",
    iconKey: "healthcare",
    segments: ["commercial"],
    summary:
      "Restrict sensitive areas and maintain monitored, auditable access across clinical facilities.",
    overview: [
      "Healthcare facilities have to stay open and approachable while tightly controlling medication storage, records, and clinical areas. Those two requirements pull in opposite directions, and the system has to serve both.",
      "Reliant separates public, clinical, and restricted zones with credentialed access and auditable records, and covers entrances, corridors, and parking without intruding on patient areas.",
    ],
    threats: [
      {
        title: "Controlled-substance diversion",
        description:
          "Medication storage requires restricted access and a defensible record of every entry.",
      },
      {
        title: "Records and patient privacy",
        description:
          "Physical access to records areas and IT rooms is part of protecting patient information.",
      },
      {
        title: "Staff safety in open facilities",
        description:
          "Public-facing entrances, after-hours access, and parking areas leave staff exposed.",
      },
    ],
    solutions: [
      {
        title: "Zoned clinical access",
        description:
          "Public, clinical, and restricted areas separated by credential, role, and schedule.",
      },
      {
        title: "Auditable entry records",
        description:
          "Time-stamped logs on medication, records, and IT areas, exportable for internal review.",
      },
      {
        title: "Perimeter and parking coverage",
        description:
          "Entrances, corridors, and lots monitored to protect staff during off-hours transitions.",
      },
    ],
    serviceSlugs: [
      "access-control",
      "cctv-surveillance",
      "security-alarm",
      "cyber-security",
    ],
  },
  {
    slug: "property-management",
    name: "Property Management",
    iconKey: "property",
    segments: ["commercial", "residential"],
    summary:
      "Protect tenants, common areas, and building assets across managed portfolios with centralized access and surveillance.",
    overview: [
      "Property managers answer for buildings they don't occupy, often several at once. What they need is centralized visibility: who has access to which property, what happened in the common areas, and how quickly a credential can be shut off.",
      "Reliant builds portfolio-wide systems where access and video are managed centrally, so a change at one property doesn't require a trip to the site.",
    ],
    threats: [
      {
        title: "Tenant turnover at scale",
        description:
          "Credentials and keys have to be reissued constantly across multiple properties.",
      },
      {
        title: "Vendor and contractor access",
        description:
          "Maintenance and service vendors need entry without receiving permanent, unrestricted keys.",
      },
      {
        title: "Common-area incidents",
        description:
          "Disputes and liability claims in shared spaces are difficult to resolve without footage.",
      },
    ],
    solutions: [
      {
        title: "Centralized credential management",
        description:
          "Issue, restrict, and revoke access across the whole portfolio from one system.",
      },
      {
        title: "Scheduled vendor access",
        description:
          "Time-limited credentials that grant entry only during the window a vendor is expected.",
      },
      {
        title: "Documented common areas",
        description:
          "Retained footage of entrances, corridors, and amenity spaces for incident review.",
      },
    ],
    serviceSlugs: [
      "access-control",
      "cctv-surveillance",
      "security-alarm",
      "network-cabling",
    ],
  },
];

/** Every industry slug — used for static generation. */
export const ALL_INDUSTRY_SLUGS: string[] = INDUSTRIES.map((i) => i.slug);

export function findIndustryBySlug(
  slug: string,
): TaxonomyIndustry | undefined {
  return INDUSTRIES.find((i) => i.slug === slug);
}

export function industriesInSegment(
  segment: IndustrySegment | "",
): TaxonomyIndustry[] {
  if (!segment) return INDUSTRIES;
  return INDUSTRIES.filter((i) => i.segments.includes(segment));
}
