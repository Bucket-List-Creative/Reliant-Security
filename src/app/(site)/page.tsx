import { sanityFetch } from "@/sanity/lib/live";
import {
  SERVICES_QUERY,
  STATS_QUERY,
  TESTIMONIALS_QUERY,
  FAQS_QUERY,
  SITE_SETTINGS_QUERY,
  FEATURED_PROJECTS_QUERY,
  INDUSTRIES_QUERY,
} from "@/sanity/lib/queries";
import type {
  Service,
  Stat,
  Testimonial,
  Faq,
  SiteSettings,
  ProjectListItem,
  IndustryListItem,
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

/** Slug → local hero photo, for taxonomy-sourced projects. */
const LOCAL_PROJECT_IMAGES = new Map(
  PROJECTS.map((p) => [p.slug, publicAssetOrUndefined(p.image)]),
);

export default async function HomePage() {
  const [services, stats, industries, projects, testimonials, faqs, settings] =
    await Promise.all([
      sanityFetch({ query: SERVICES_QUERY }),
      sanityFetch({ query: STATS_QUERY }),
      sanityFetch({ query: INDUSTRIES_QUERY }),
      sanityFetch({ query: FEATURED_PROJECTS_QUERY }),
      sanityFetch({ query: TESTIMONIALS_QUERY }),
      sanityFetch({ query: FAQS_QUERY }),
      sanityFetch({ query: SITE_SETTINGS_QUERY }),
    ]);

  const phone = (settings.data as SiteSettings | null)?.phone;

  return (
    <>
      <Hero />
      {/* Monitoring-network stats sit high on the page, per client feedback. */}
      <StatBar stats={stats.data as Stat[]} />
      {/* Full scope of the company, before anything residential-specific. */}
      <CapabilitiesGrid />
      <ServiceDirectory services={services.data as Service[]} />
      <IndustryTabs industries={industries.data as IndustryListItem[]} />
      <ProjectsStrip
        projects={projects.data as ProjectListItem[]}
        localImageBySlug={LOCAL_PROJECT_IMAGES}
      />
      <Testimonials testimonials={testimonials.data as Testimonial[]} />

      <section className="sfc-section" id="service-area">
        <Container>
          <div className="mb-8 max-w-2xl">
            <h2 className="text-3xl font-bold sm:text-4xl">
              Serving the greater St.&nbsp;Louis area
            </h2>
            <p className="mt-4 text-lg text-n-700">
              Reliant is locally owned and operated out of
              O&apos;Fallon,&nbsp;Missouri, serving communities across the
              St.&nbsp;Louis metro — and travelling further for commercial,
              industrial, and government projects.
            </p>
          </div>
          {/* Clean outline with a single home-location pin. The full
              searchable community map lives on the Contact page. */}
          <ServiceAreaMap
            height={460}
            pins="home"
            showSearch={false}
            showFilter={false}
            showSidebar={false}
          />
        </Container>
      </section>

      <FaqAccordion faqs={faqs.data as Faq[]} />
      <CtaBanner phone={phone} />
    </>
  );
}
