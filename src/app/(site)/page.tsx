import { sanityFetch } from "@/sanity/lib/live";
import {
  SERVICES_QUERY,
  STATS_QUERY,
  TESTIMONIALS_QUERY,
  SITE_SETTINGS_QUERY,
  FEATURED_PROJECTS_QUERY,
  INDUSTRIES_QUERY,
  HOME_PAGE_QUERY,
} from "@/sanity/lib/queries";
import type {
  Service,
  Stat,
  Testimonial,
  SiteSettings,
  ProjectListItem,
  IndustryListItem,
  HomePageContent,
} from "@/sanity/lib/types";
import { Container } from "@/components/ui/Container";
import { ServiceAreaMap } from "@/components/ui/ServiceAreaMap";
import { Hero } from "@/components/sections/Hero";
import { StatBar } from "@/components/sections/StatBar";
import { CapabilitiesGrid } from "@/components/sections/CapabilitiesGrid";
import { ServiceDirectory } from "@/components/sections/ServiceDirectory";
import { IndustryTabs } from "@/components/sections/IndustryTabs";
import { ProjectsStrip } from "@/components/sections/ProjectsStrip";
import { Testimonials } from "@/components/sections/Testimonials";
import { FaqAccordion } from "@/components/sections/FaqAccordion";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { PROJECTS } from "@/content/projects";
import { publicAssetOrUndefined } from "@/lib/publicAssets";
import { HOME_DEFAULTS } from "@/content/pages";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import {
  organizationJsonLd,
  webSiteJsonLd,
  jsonLdGraph,
} from "@/lib/schema";
import { LOCATIONS } from "@/content/locations";

/**
 * The home page previously inherited the root layout's title and description
 * and emitted neither a canonical nor any Open Graph tags. `title: undefined`
 * keeps the root default (which is already the strongest phrasing we have)
 * while still attaching the canonical and social card.
 */
export const metadata: Metadata = buildMetadata({
  description:
    "Locally owned security and low-voltage integrator in O'Fallon, Missouri. Alarm systems, video surveillance, access control, structured cabling and fiber, and 24/7 professional monitoring for homes, businesses, industrial plants, and government facilities.",
  path: "/",
  socialTitle: "Reliant Security — Security & low-voltage integration",
});

/** Slug → local hero photo, for taxonomy-sourced projects. */
const LOCAL_PROJECT_IMAGES = new Map(
  PROJECTS.map((p) => [p.slug, publicAssetOrUndefined(p.image)]),
);

export default async function HomePage() {
  const [services, stats, industries, projects, testimonials, settings, page] =
    await Promise.all([
      sanityFetch({ query: SERVICES_QUERY }),
      sanityFetch({ query: STATS_QUERY }),
      sanityFetch({ query: INDUSTRIES_QUERY }),
      sanityFetch({ query: FEATURED_PROJECTS_QUERY }),
      sanityFetch({ query: TESTIMONIALS_QUERY }),
      sanityFetch({ query: SITE_SETTINGS_QUERY }),
      sanityFetch({ query: HOME_PAGE_QUERY }),
    ]);

  const s = settings.data as SiteSettings | null;
  const cms = page.data as HomePageContent | null;
  const phone = s?.phone;

  // The home page carried no business identity at all before this — only an
  // FAQPage node. Organization + WebSite is the anchor every other page's
  // structured data now points back to.
  const jsonLd = jsonLdGraph(
    organizationJsonLd({
      settings: s,
      areaServed: LOCATIONS.map((l) => l.city),
    }),
    webSiteJsonLd(),
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero
        eyebrow={cms?.eyebrow}
        title={cms?.title}
        subtitle={cms?.subtitle}
        primaryCta={
          cms?.primaryCta?.label && cms.primaryCta.href
            ? { label: cms.primaryCta.label, href: cms.primaryCta.href }
            : undefined
        }
        secondaryCta={
          cms?.secondaryCta?.label && cms.secondaryCta.href
            ? { label: cms.secondaryCta.label, href: cms.secondaryCta.href }
            : undefined
        }
      />
      {/* Monitoring-network stats sit high on the page, per client feedback. */}
      <StatBar stats={stats.data as Stat[]} />
      {/* Full scope of the company, before anything residential-specific. */}
      <CapabilitiesGrid
        heading={cms?.capabilities?.heading}
        subheading={cms?.capabilities?.subheading}
        items={cms?.capabilities?.items}
      />
      <ServiceDirectory
        services={services.data as Service[]}
        heading={cms?.serviceDirectory?.heading}
        subheading={cms?.serviceDirectory?.subheading}
      />
      <IndustryTabs
        industries={industries.data as IndustryListItem[]}
        heading={cms?.industries?.heading}
        subheading={cms?.industries?.subheading}
      />
      <ProjectsStrip
        projects={projects.data as ProjectListItem[]}
        localImageBySlug={LOCAL_PROJECT_IMAGES}
        heading={cms?.projects?.heading}
        subheading={cms?.projects?.subheading}
      />
      <Testimonials
        testimonials={testimonials.data as Testimonial[]}
        heading={cms?.testimonials?.heading}
      />

      <section className="sfc-section" id="service-area">
        <Container>
          <div className="mb-8 max-w-2xl">
            <h2 className="text-3xl font-bold sm:text-4xl">
              {cms?.serviceArea?.heading || HOME_DEFAULTS.serviceArea.heading}
            </h2>
            <p className="mt-4 text-lg text-n-700">
              {cms?.serviceArea?.subheading || HOME_DEFAULTS.serviceArea.subheading}
            </p>
          </div>
          {/* A single home-location pin. The full searchable community map
              lives on the Contact page. */}
          <ServiceAreaMap
            height={460}
            pins="home"
            showSearch={false}
            showFilter={false}
            showSidebar={false}
          />
        </Container>
      </section>

      <FaqAccordion ctaLabel="Request a Free Consultation" showServiceLink />
      <CtaBanner phone={phone} />
    </>
  );
}
