import type { ServiceIconKey } from "@/components/ui/ServiceIcon";

/**
 * Built-in page copy — the wording that renders before anyone edits anything
 * in Sanity.
 *
 * This lives in `src/content/` for the same reason the service and industry
 * taxonomies do: the pages render from it AND `scripts/seed-sanity.ts` reads
 * it, so the Studio opens pre-filled with exactly what the site already says.
 * Edit here and the default moves; edit in Sanity and the CMS wins.
 *
 * ⚠️ "24/7" attaches to professional monitoring only. Reliant does not offer
 * round-the-clock service or technical support and no copy may imply it.
 */

export type PageCard = {
  title: string;
  description: string;
  iconKey: ServiceIconKey;
  /** Only used by cards that link somewhere (the home page rail). */
  href?: string;
};

export const HOME_CAPABILITIES: PageCard[] = [
  {
    title: "Residential Security",
    description:
      "Monitored alarms, cameras, and smart control for single-family homes, custom homes, and multi-family properties.",
    iconKey: "home",
    href: "/industries?segment=residential",
  },
  {
    title: "Commercial Security",
    description:
      "Offices, retail, healthcare, and warehousing — systems designed around how the building is actually used.",
    iconKey: "building",
    href: "/industries?segment=commercial",
  },
  {
    title: "Industrial & Government",
    description:
      "Large plants, manufacturing sites, and Federal, State, Municipal, and DoD facilities — including NDAA/TAA-compliant equipment.",
    iconKey: "factory",
    href: "/industries?segment=industrial",
  },
  {
    title: "Video Surveillance",
    description:
      "Hardwired and wireless camera systems, from a single doorbell to site-wide industrial coverage.",
    iconKey: "cctv",
    href: "/services/cctv-surveillance",
  },
  {
    title: "Access Control",
    description:
      "Keyless entry, mobile credentials, role-based permissions, and a full audit trail on every door.",
    iconKey: "key",
    href: "/services/access-control",
  },
  {
    title: "Structured Cabling & Fiber",
    description:
      "Cat6/Cat6A, fiber, racks, and pathways — certified, labeled, and documented infrastructure.",
    iconKey: "network",
    href: "/services/network-cabling",
  },
  {
    title: "Audio/Video",
    description:
      "Distributed audio, displays, and conference-room AV for homes and businesses alike.",
    iconKey: "speaker",
    href: "/services/audio-video",
  },
  {
    title: "24/7 Professional Monitoring",
    description:
      "UL-certified central-station monitoring for intrusion, smoke, and carbon monoxide, every hour of the year.",
    iconKey: "shield-check",
    href: "/pricing",
  },
];

export const ABOUT_DIFFERENTIATORS: PageCard[] = [
  {
    title: "Locally owned and operated",
    description:
      "Reliant is based in O'Fallon, Missouri, and run by people who live here. You deal with the same local team from the first walkthrough to service years later — not a call centre in another state.",
    iconKey: "home",
  },
  {
    title: "Built for projects of any size",
    description:
      "Local ownership doesn't mean limited capability. We handle single-family alarm systems and large, complex commercial, industrial, and government installations with the same team and the same standards.",
    iconKey: "factory",
  },
  {
    title: "Not tied to any one manufacturer",
    description:
      "We aren't locked into a single manufacturer or proprietary platform. Systems are designed around what your site actually needs — including NDAA/TAA-compliant equipment where a project requires it.",
    iconKey: "grid",
  },
  {
    title: "One team, end to end",
    description:
      "Security, surveillance, access control, structured cabling, fiber, and audio/video all come from us. There's no gap between the cabling contractor and the systems integrator, and no argument about whose problem it is.",
    iconKey: "network",
  },
  {
    title: "24/7 professional monitoring",
    description:
      "Systems are backed by a UL-certified, fully redundant central-station network averaging a 9.4-second response, monitoring intrusion, smoke, and carbon monoxide every hour of the year.",
    iconKey: "shield-check",
  },
  {
    title: "Accredited and accountable",
    description:
      "Reliant holds BBB A+ accreditation and strong Google and Angi reviews — earned on installations we still stand behind and service.",
    iconKey: "cyber",
  },
];

export const ABOUT_CUSTOMERS: PageCard[] = [
  {
    title: "Residential",
    description: "Alarms, cameras, smart control, and monitoring for homes.",
    iconKey: "home",
  },
  {
    title: "Custom Homes",
    description:
      "Pre-construction design, structured cabling, AV, and whole-home integration.",
    iconKey: "custom-home",
  },
  {
    title: "Multi-Family",
    description:
      "Access control, intercoms, and common-area surveillance for communities.",
    iconKey: "multi-family",
  },
  {
    title: "Commercial",
    description:
      "Offices, retail, healthcare, and warehousing across the metro and beyond.",
    iconKey: "building",
  },
  {
    title: "Industrial",
    description:
      "Plants and manufacturing sites, including harsh-environment installations.",
    iconKey: "factory",
  },
  {
    title: "Government & DoD",
    description:
      "Federal, State, Municipal, and Department of Defense facilities.",
    iconKey: "government",
  },
];

export const HOME_DEFAULTS = {
  hero: {
    eyebrow: "24/7 Professional Monitoring",
    title: "Security that feels effortless.",
    subtitle:
      "Reliant Security designs, installs, and services security and low-voltage systems for homes, custom homes, multi-family, commercial, industrial, and government facilities — backed by 24/7 professional monitoring.",
    primaryCta: { label: "Get a Same-Day Quote", href: "/contact" },
    secondaryCta: { label: "Explore services", href: "/services" },
  },
  capabilities: {
    heading: "One local team, from a single home to a full industrial site",
    subheading:
      "Reliant Security is a locally owned security and low-voltage integrator. We design, install, and service everything here — so whether you need an alarm on a house or surveillance, access control, and fiber across a manufacturing plant, it's the same team and the same standard.",
  },
  serviceDirectory: {
    heading: "What we protect",
    subheading:
      "End-to-end security and low-voltage systems, designed around how your home or facility actually operates.",
  },
  industries: {
    heading: "Industries we serve",
    subheading:
      "From a single home to a manufacturing plant or a government facility — security tuned to the threats your sector actually faces.",
  },
  projects: {
    heading: "Proven on real projects",
    subheading:
      "From industrial plants to commercial buildings and homes — see what we design, install, and stand behind.",
  },
  testimonials: {
    heading: "Trusted by homes and businesses",
    subheading: "",
  },
  serviceArea: {
    heading:
      "Serving the greater St. Louis area and multi-site customers throughout the US",
    subheading:
      "Reliant is locally owned and operated out of O'Fallon, Missouri, serving homes and businesses across the St. Louis metro. For commercial, industrial, and government customers we work nationally — standardising security, surveillance, and low-voltage systems across multi-site estates wherever those sites happen to be.",
  },
};

export const ABOUT_DEFAULTS = {
  badge: "About us",
  heading: "Locally owned. Built for projects of any size.",
  differentiators: {
    heading: "What makes us different",
    subheading:
      "The reasons customers pick us — and, more often, the reasons they stay.",
  },
  customers: {
    heading: "Who we serve",
    subheading: "From a single household to a Department of Defense facility.",
  },
};

export const SERVICES_PAGE_DEFAULTS = {
  badge: "Our services",
  heading: "Protection for every corner of your world",
  intro:
    "From a single smart lock to surveillance, access control, and fiber across an industrial campus, we design, install, and support security and low-voltage systems that fit — backed by 24/7 professional monitoring and a local team that answers the phone.",
};

/**
 * Built-in navigation. `Services` is rendered as a generated mega-menu
 * regardless of what the CMS holds, so it carries no children here.
 */
export const NAV_DEFAULTS = {
  ctaLabel: "Get a Free Quote",
  primary: [
    { label: "Services", href: "/services" },
    {
      label: "Industries",
      href: "/industries",
      children: [
        { label: "Residential", href: "/industries?segment=residential", iconKey: "home", desc: "Homes, custom homes & multi-family" },
        { label: "Commercial", href: "/industries?segment=commercial", iconKey: "building", desc: "Offices, retail, healthcare & more" },
        { label: "Industrial", href: "/industries?segment=industrial", iconKey: "factory", desc: "Plants, manufacturing & logistics" },
        { label: "Government", href: "/industries?segment=government", iconKey: "government", desc: "Federal, State, Municipal & DoD" },
        { label: "All industries", href: "/industries", iconKey: "grid", desc: "Browse every sector" },
      ],
    },
    {
      label: "About",
      href: "/about",
      children: [
        { label: "About Us", href: "/about", iconKey: "team", desc: "Our story, team & partners" },
        { label: "Projects", href: "/projects", iconKey: "projects", desc: "Real installations we've delivered" },
        { label: "Resources", href: "/resources", iconKey: "resources", desc: "Guides, downloads & explainers" },
        { label: "Blog", href: "/blog", iconKey: "resources", desc: "Security news, tips & insight" },
        { label: "Areas we serve", href: "/areas-we-serve", iconKey: "home", desc: "Communities across the St. Louis metro" },
      ],
    },
    { label: "Pricing", href: "/pricing" },
    { label: "Contact", href: "/contact" },
  ],
  footerLinks: [
    { label: "Services", href: "/services" },
    { label: "Industries", href: "/industries" },
    { label: "Projects", href: "/projects" },
    { label: "Pricing", href: "/pricing" },
    { label: "Resources", href: "/resources" },
    { label: "Blog", href: "/blog" },
    { label: "Areas we serve", href: "/areas-we-serve" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Privacy Policy", href: "/privacy-policy" },
  ],
};
