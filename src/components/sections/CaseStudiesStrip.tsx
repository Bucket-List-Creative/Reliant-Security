import Link from "next/link";
import { IconArrowRight } from "@tabler/icons-react";
import { Container } from "@/components/ui/Container";
import { CaseStudyCard } from "@/components/sections/CaseStudyCard";
import type { CaseStudyListItem } from "@/sanity/lib/types";

const FALLBACK: CaseStudyListItem[] = [
  {
    _id: "cs1",
    slug: "retail-chain-surveillance",
    title: "Multi-site surveillance for a regional retail chain",
    client: "Northgate Retail",
    industry: "Retail",
    summary:
      "Unified camera and access control across 6 locations, managed from a single dashboard.",
    publishedAt: "",
  },
  {
    _id: "cs2",
    slug: "warehouse-access-control",
    title: "24/7 access control for a distribution warehouse",
    client: "Vantage Logistics",
    industry: "Warehousing",
    summary:
      "Keyless entry, audit logging, and rapid-response monitoring for a high-traffic facility.",
    publishedAt: "",
  },
  {
    _id: "cs3",
    slug: "medical-office-security",
    title: "Compliant security for a multi-tenant medical office",
    client: "Cedar Health Partners",
    industry: "Healthcare",
    summary:
      "Restricted-area access, HD surveillance, and after-hours monitoring built for compliance.",
    publishedAt: "",
  },
];

export function CaseStudiesStrip({
  caseStudies,
  heading = "Proven on real projects",
  subheading = "See how we design and deploy security for businesses like yours.",
}: {
  caseStudies?: CaseStudyListItem[];
  heading?: string;
  subheading?: string;
}) {
  const items = caseStudies?.length ? caseStudies : FALLBACK;

  return (
    <section className="sfc-section" id="case-studies">
      <Container>
        <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold sm:text-4xl">{heading}</h2>
            <p className="mt-4 text-lg text-n-700">{subheading}</p>
          </div>
          <Link
            href="/case-studies"
            className="inline-flex items-center gap-1 font-semibold text-brand-press hover:underline"
          >
            All case studies
            <IconArrowRight size={16} stroke={2} aria-hidden />
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {items.map((item) => (
            <CaseStudyCard key={item._id} item={item} />
          ))}
        </div>
      </Container>
    </section>
  );
}
