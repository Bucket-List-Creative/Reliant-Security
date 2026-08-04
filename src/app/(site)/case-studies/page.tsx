import type { Metadata } from "next";
import { sanityFetch } from "@/sanity/lib/live";
import { CASE_STUDIES_QUERY, SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";
import type { CaseStudyListItem, SiteSettings } from "@/sanity/lib/types";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { CaseStudyCard } from "@/components/sections/CaseStudyCard";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { CaseStudiesStrip } from "@/components/sections/CaseStudiesStrip";

export const metadata: Metadata = {
  title: "Case Studies",
  description:
    "Real security projects delivered by Reliant Security — surveillance, access control, and monitoring for businesses.",
};

export default async function CaseStudiesPage() {
  const [{ data: caseStudies }, { data: settings }] = await Promise.all([
    sanityFetch({ query: CASE_STUDIES_QUERY }),
    sanityFetch({ query: SITE_SETTINGS_QUERY }),
  ]);

  const items = (caseStudies as CaseStudyListItem[]) ?? [];
  const phone = (settings as SiteSettings | null)?.phone;

  return (
    <>
      <section className="sfc-section pt-12">
        <Container>
          <div className="max-w-2xl">
            <Badge className="mb-5">Case studies</Badge>
            <h1 className="text-4xl font-bold sm:text-5xl">
              Security we&apos;ve delivered in the field
            </h1>
            <p className="mt-5 text-lg text-n-700">
              A look at the projects behind Reliant — the challenges, what we
              deployed, and the results our clients rely on.
            </p>
          </div>
        </Container>
      </section>

      {items.length === 0 ? (
        // Show the designed sample strip until real case studies are published.
        <CaseStudiesStrip
          heading="Sample projects"
          subheading="Add case studies in the Studio to replace these examples."
        />
      ) : (
        <section className="sfc-section pt-0">
          <Container>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <CaseStudyCard key={item._id} item={item} />
              ))}
            </div>
          </Container>
        </section>
      )}

      <CtaBanner phone={phone} />
    </>
  );
}
