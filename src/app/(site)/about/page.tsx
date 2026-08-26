import type { Metadata } from "next";
import { sanityFetch } from "@/sanity/lib/live";
import {
  SITE_SETTINGS_QUERY,
  FEATURED_PROJECTS_QUERY,
  PARTNERS_QUERY,
  TESTIMONIALS_QUERY,
} from "@/sanity/lib/queries";
import type {
  SiteSettings,
  ProjectListItem,
  Partner,
  Testimonial,
} from "@/sanity/lib/types";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Card, CardIcon } from "@/components/ui/Card";
import { VideoEmbed } from "@/components/ui/VideoEmbed";
import { ServiceIcon, type ServiceIconKey } from "@/components/ui/ServiceIcon";
import { TrustBar } from "@/components/sections/TrustBar";
import { PartnerGrid } from "@/components/sections/PartnerGrid";
import { ProjectsStrip } from "@/components/sections/ProjectsStrip";
import { Testimonials } from "@/components/sections/Testimonials";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { PROJECTS } from "@/content/projects";
import { publicAssetOrUndefined } from "@/lib/publicAssets";

export const metadata: Metadata = {
  title: "About",
  description:
    "Reliant Security is a locally owned, BBB A+ accredited security and low-voltage integrator serving homes, custom homes, multi-family, commercial, industrial, and government facilities.",
};

const LOCAL_PROJECT_IMAGES = new Map(
  PROJECTS.map((p) => [p.slug, publicAssetOrUndefined(p.image)]),
);

/**
 * ⚠️ Several statements below need Reliant's confirmation before launch:
 * founding year and company history, licence numbers, certifications, and
 * team/vehicle photography. Anything not yet verified is written so it stays
 * true without specifics — but the specifics are what make this page work,
 * so they should be filled in as soon as the client provides them.
 */

const DIFFERENTIATORS: {
  title: string;
  description: string;
  iconKey: ServiceIconKey;
}[] = [
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

/** Rotated across the differentiator cards so the grid isn't monochrome. */
const DIFF_ACCENTS = [
  "sfc-accent-green",
  "sfc-accent-amber",
  "sfc-accent-violet",
  "sfc-accent-blue",
  "sfc-accent-teal",
  "sfc-accent-rose",
];

const CUSTOMERS: {
  name: string;
  description: string;
  iconKey: ServiceIconKey;
  accent: string;
}[] = [
  {
    name: "Residential",
    description: "Alarms, cameras, smart control, and monitoring for homes.",
    iconKey: "home",
    accent: "sfc-accent-green",
  },
  {
    name: "Custom Homes",
    description:
      "Pre-construction design, structured cabling, AV, and whole-home integration.",
    iconKey: "custom-home",
    accent: "sfc-accent-teal",
  },
  {
    name: "Multi-Family",
    description:
      "Access control, intercoms, and common-area surveillance for communities.",
    iconKey: "multi-family",
    accent: "sfc-accent-rose",
  },
  {
    name: "Commercial",
    description:
      "Offices, retail, healthcare, and warehousing across the metro and beyond.",
    iconKey: "building",
    accent: "sfc-accent-blue",
  },
  {
    name: "Industrial",
    description:
      "Plants and manufacturing sites, including harsh-environment installations.",
    iconKey: "factory",
    accent: "sfc-accent-amber",
  },
  {
    name: "Government & DoD",
    description:
      "Federal, State, Municipal, and Department of Defense facilities.",
    iconKey: "government",
    accent: "sfc-accent-violet",
  },
];

export default async function AboutPage() {
  const [
    { data: settings },
    { data: projects },
    { data: partners },
    { data: testimonials },
  ] = await Promise.all([
    sanityFetch({ query: SITE_SETTINGS_QUERY }),
    sanityFetch({ query: FEATURED_PROJECTS_QUERY }),
    sanityFetch({ query: PARTNERS_QUERY }),
    sanityFetch({ query: TESTIMONIALS_QUERY }),
  ]);

  const s = settings as SiteSettings | null;

  return (
    <>
      {/* Intro */}
      <section className="sfc-section pt-12">
        <Container>
          <div className="max-w-3xl">
            <Badge className="mb-5">About us</Badge>
            <h1 className="text-4xl font-bold sm:text-5xl">
              Locally owned. Built for projects of any size.
            </h1>
            <div className="mt-5 space-y-4 text-lg leading-relaxed text-n-700">
              <p>
                Reliant Security is a locally owned security and low-voltage
                integrator based in O&apos;Fallon, Missouri. We design,
                install, service, and monitor systems for homes, custom homes,
                multi-family communities, commercial buildings, industrial
                plants, and government facilities.
              </p>
              <p>
                Most companies pick a lane. Residential alarm dealers don&apos;t
                pull fiber across a manufacturing campus, and commercial
                contractors aren&apos;t interested in a house. Reliant does
                both — the same technicians, the same design discipline, and
                the same standard of finish whether it&apos;s four sensors and
                a doorbell camera or site-wide surveillance, access control,
                and a fiber backbone tying six buildings together.
              </p>
              <p>
                That range is deliberate. It means we can start with a customer
                on their home, grow with their business, and still be the right
                call when they need a specified, compliant installation for a
                public-sector project.
              </p>
            </div>
          </div>

          <div className="mt-10">
            <TrustBar
              bbbUrl={s?.bbbUrl}
              googleReviewsUrl={s?.googleReviewsUrl}
              angiesListUrl={s?.angiesListUrl}
            />
          </div>
        </Container>
      </section>

      {/* Video */}
      <section className="sfc-section pt-0">
        <Container>
          <div className="mx-auto max-w-4xl">
            <VideoEmbed
              url={
                s?.aboutVideoUrl ??
                "https://youtu.be/mDzCBdZtvZc?si=wCenDWdwfKsWDjv_"
              }
              title="About Reliant Security"
            />
          </div>
        </Container>
      </section>

      {/* What makes us different */}
      <section className="sfc-section" id="what-makes-us-different">
        <Container>
          <div className="mb-12 max-w-2xl">
            <h2 className="text-3xl font-bold sm:text-4xl">
              What makes us different
            </h2>
            <p className="mt-4 text-lg text-n-700">
              The reasons customers pick us — and, more often, the reasons they
              stay.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {DIFFERENTIATORS.map((d, i) => (
              <Card
                key={d.title}
                className={`sfc-card--accent ${DIFF_ACCENTS[i % DIFF_ACCENTS.length]} flex h-full flex-col`}
              >
                <CardIcon>
                  <ServiceIcon name={d.iconKey} size={26} />
                </CardIcon>
                <h3 className="mt-5 text-lg font-semibold">{d.title}</h3>
                <p className="mt-2 flex-1">{d.description}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Who we serve */}
      <section className="sfc-section pt-0" id="who-we-serve">
        <Container>
          <div className="mb-12 max-w-2xl">
            <h2 className="text-3xl font-bold sm:text-4xl">Who we serve</h2>
            <p className="mt-4 text-lg text-n-700">
              From a single household to a Department of Defense facility.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {CUSTOMERS.map((c) => (
              <Card
                key={c.name}
                className={`sfc-card--accent ${c.accent} flex h-full flex-col`}
              >
                <CardIcon>
                  <ServiceIcon name={c.iconKey} size={26} />
                </CardIcon>
                <h3 className="mt-5 text-lg font-semibold">{c.name}</h3>
                <p className="mt-2 flex-1 text-n-700">{c.description}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Featured work */}
      <ProjectsStrip
        projects={projects as ProjectListItem[]}
        localImageBySlug={LOCAL_PROJECT_IMAGES}
        heading="Featured work"
        subheading="A sample of the installations we've delivered — with more added as projects wrap."
      />

      {/* Technology partners */}
      <PartnerGrid partners={partners as Partner[]} />

      {/* Testimonials */}
      <Testimonials
        testimonials={testimonials as Testimonial[]}
        heading="What our customers say"
      />

      <CtaBanner phone={s?.phone} />
    </>
  );
}
