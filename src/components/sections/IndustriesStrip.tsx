import Link from "next/link";
import { IconArrowRight } from "@tabler/icons-react";
import { Container } from "@/components/ui/Container";
import { IndustryCard } from "@/components/sections/IndustryCard";
import type { IndustryListItem } from "@/sanity/lib/types";
import { INDUSTRIES } from "@/content/industries";

/**
 * Defaults come from the shared taxonomy, featured entries first, so the home
 * page strip spans residential through government rather than reading as a
 * commercial-only or residential-only list.
 */
const FALLBACK: IndustryListItem[] = [...INDUSTRIES]
  .sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)))
  .map((i) => ({
    _id: `taxonomy-${i.slug}`,
    slug: i.slug,
    icon: i.icon,
    name: i.name,
    summary: i.summary,
    segments: i.segments,
  }));

export function IndustriesStrip({
  industries,
  heading = "Industries we serve",
  subheading = "From a single home to a manufacturing plant or a government facility — security tuned to the threats your sector actually faces.",
  // Two full rows on desktop, so the range on show spans residential through
  // government rather than stopping at the first four commercial sectors.
  max = 8,
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
