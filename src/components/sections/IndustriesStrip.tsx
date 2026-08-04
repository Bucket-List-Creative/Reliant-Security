import Link from "next/link";
import { IconArrowRight } from "@tabler/icons-react";
import { Container } from "@/components/ui/Container";
import { IndustryCard } from "@/components/sections/IndustryCard";
import type { IndustryListItem } from "@/sanity/lib/types";

const FALLBACK: IndustryListItem[] = [
  {
    _id: "in1",
    slug: "retail",
    icon: "🏪",
    name: "Retail",
    summary:
      "Deter theft, protect staff, and monitor multiple storefronts from one place.",
  },
  {
    _id: "in2",
    slug: "warehousing",
    icon: "📦",
    name: "Warehousing & Logistics",
    summary:
      "Control access, secure inventory, and keep high-traffic facilities safe around the clock.",
  },
  {
    _id: "in3",
    slug: "healthcare",
    icon: "🏥",
    name: "Healthcare",
    summary:
      "Restrict sensitive areas and stay compliant with monitored, auditable access.",
  },
  {
    _id: "in4",
    slug: "property-management",
    icon: "🏢",
    name: "Property Management",
    summary:
      "Protect tenants and common areas with smart access control and surveillance.",
  },
];

export function IndustriesStrip({
  industries,
  heading = "Industries we serve",
  subheading = "Security tuned to the threats your sector actually faces.",
  max = 4,
}: {
  industries?: IndustryListItem[];
  heading?: string;
  subheading?: string;
  max?: number;
}) {
  const items = (industries?.length ? industries : FALLBACK).slice(0, max);

  return (
    <section className="sfc-section" id="industries">
      <Container>
        <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold sm:text-4xl">{heading}</h2>
            <p className="mt-4 text-lg text-n-700">{subheading}</p>
          </div>
          <Link
            href="/industries"
            className="inline-flex items-center gap-1 font-semibold text-brand-press hover:underline"
          >
            All industries
            <IconArrowRight size={16} stroke={2} aria-hidden />
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <IndustryCard key={item._id} item={item} />
          ))}
        </div>
      </Container>
    </section>
  );
}
