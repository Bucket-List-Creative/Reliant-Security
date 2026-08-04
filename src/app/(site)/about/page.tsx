import type { Metadata } from "next";
import { sanityFetch } from "@/sanity/lib/live";
import {
  SITE_SETTINGS_QUERY,
  FEATURED_CASE_STUDIES_QUERY,
  PARTNERS_QUERY,
  TESTIMONIALS_QUERY,
} from "@/sanity/lib/queries";
import type {
  SiteSettings,
  CaseStudyListItem,
  Partner,
  Testimonial,
} from "@/sanity/lib/types";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { VideoEmbed } from "@/components/ui/VideoEmbed";
import { TrustBar } from "@/components/sections/TrustBar";
import { PartnerGrid } from "@/components/sections/PartnerGrid";
import { CaseStudiesStrip } from "@/components/sections/CaseStudiesStrip";
import { Testimonials } from "@/components/sections/Testimonials";
import { CtaBanner } from "@/components/sections/CtaBanner";

export const metadata: Metadata = {
  title: "About",
  description:
    "Reliant Security is a BBB A+ accredited team protecting homes and businesses with premium, monitored security and trusted technology partners.",
};

export default async function AboutPage() {
  const [
    { data: settings },
    { data: caseStudies },
    { data: partners },
    { data: testimonials },
  ] = await Promise.all([
    sanityFetch({ query: SITE_SETTINGS_QUERY }),
    sanityFetch({ query: FEATURED_CASE_STUDIES_QUERY }),
    sanityFetch({ query: PARTNERS_QUERY }),
    sanityFetch({ query: TESTIMONIALS_QUERY }),
  ]);

  const s = settings as SiteSettings | null;

  return (
    <>
      {/* Mission */}
      <section className="sfc-section pt-12">
        <Container>
          <div className="max-w-3xl">
            <Badge className="mb-5">About us</Badge>
            <h1 className="text-4xl font-bold sm:text-5xl">
              Security you can rely on — proven, monitored, local
            </h1>
            <p className="mt-5 text-lg text-n-700">
              Reliant Security designs, installs, and monitors premium security
              for homes and businesses. We&apos;re BBB A+ accredited and hold
              strong reviews on Google and Angi — because we treat every
              property like our own, with fast response and technology that
              actually works.
            </p>
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
              url="https://youtu.be/mDzCBdZtvZc?si=wCenDWdwfKsWDjv_"
              title="About Reliant Security"
            />
          </div>
        </Container>
      </section>

      {/* Featured work */}
      <CaseStudiesStrip
        caseStudies={caseStudies as CaseStudyListItem[]}
        heading="Featured work"
        subheading="A sample of the projects we've delivered for businesses like yours."
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
