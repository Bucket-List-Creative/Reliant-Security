import { sanityFetch } from "@/sanity/lib/live";
import {
  SERVICES_QUERY,
  STATS_QUERY,
  TESTIMONIALS_QUERY,
  FAQS_QUERY,
  SITE_SETTINGS_QUERY,
  FEATURED_CASE_STUDIES_QUERY,
  INDUSTRIES_QUERY,
} from "@/sanity/lib/queries";
import type {
  Service,
  Stat,
  Testimonial,
  Faq,
  SiteSettings,
  CaseStudyListItem,
  IndustryListItem,
} from "@/sanity/lib/types";
import { Container } from "@/components/ui/Container";
import { ServiceAreaMap } from "@/components/ui/ServiceAreaMap";
import { Hero } from "@/components/sections/Hero";
import { StatBar } from "@/components/sections/StatBar";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { IndustriesStrip } from "@/components/sections/IndustriesStrip";
import { CaseStudiesStrip } from "@/components/sections/CaseStudiesStrip";
import { Testimonials } from "@/components/sections/Testimonials";
import { FaqAccordion } from "@/components/sections/FaqAccordion";
import { CtaBanner } from "@/components/sections/CtaBanner";

export default async function HomePage() {
  const [
    services,
    stats,
    industries,
    caseStudies,
    testimonials,
    faqs,
    settings,
  ] = await Promise.all([
    sanityFetch({ query: SERVICES_QUERY }),
    sanityFetch({ query: STATS_QUERY }),
    sanityFetch({ query: INDUSTRIES_QUERY }),
    sanityFetch({ query: FEATURED_CASE_STUDIES_QUERY }),
    sanityFetch({ query: TESTIMONIALS_QUERY }),
    sanityFetch({ query: FAQS_QUERY }),
    sanityFetch({ query: SITE_SETTINGS_QUERY }),
  ]);

  const phone = (settings.data as SiteSettings | null)?.phone;

  return (
    <>
      <Hero />
      <StatBar stats={stats.data as Stat[]} />
      <ServicesGrid services={services.data as Service[]} />
      <IndustriesStrip industries={industries.data as IndustryListItem[]} />
      <CaseStudiesStrip
        caseStudies={caseStudies.data as CaseStudyListItem[]}
      />
      <Testimonials testimonials={testimonials.data as Testimonial[]} />

      <section className="sfc-section" id="service-area">
        <Container>
          <div className="mb-8 max-w-2xl">
            <h2 className="text-3xl font-bold sm:text-4xl">
              Serving the greater St.&nbsp;Louis area
            </h2>
            <p className="mt-4 text-lg text-n-700">
              Local, licensed, and responsive — search the map to see the
              communities we protect across the St.&nbsp;Louis metro.
            </p>
          </div>
          <ServiceAreaMap height={460} />
        </Container>
      </section>

      <FaqAccordion faqs={faqs.data as Faq[]} />
      <CtaBanner phone={phone} />
    </>
  );
}
