import type { Metadata } from "next";
import Link from "next/link";
import { sanityFetch } from "@/sanity/lib/live";
import { INDUSTRIES_QUERY, SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";
import type { IndustryListItem, SiteSettings } from "@/sanity/lib/types";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { IndustryCard } from "@/components/sections/IndustryCard";
import { CtaBanner } from "@/components/sections/CtaBanner";
import {
  INDUSTRIES,
  SEGMENT_LABELS,
  type IndustrySegment,
} from "@/content/industries";

export const metadata: Metadata = {
  title: "Industries",
  description:
    "Security and low-voltage systems for residential, custom homes, multi-family, commercial, industrial, and government facilities — from single-family alarms to Federal and DoD projects.",
};

/** Taxonomy defaults, shown until matching `industry` documents exist. */
const TAXONOMY_ITEMS: IndustryListItem[] = INDUSTRIES.map((i) => ({
  _id: `taxonomy-${i.slug}`,
  slug: i.slug,
  name: i.name,
  iconKey: i.iconKey,
  summary: i.summary,
  segments: i.segments,
  featured: i.featured ? "featured" : "standard",
}));

const FILTERS: { label: string; value: "" | IndustrySegment }[] = [
  { label: "All", value: "" },
  { label: SEGMENT_LABELS.residential, value: "residential" },
  { label: SEGMENT_LABELS.commercial, value: "commercial" },
  { label: SEGMENT_LABELS.industrial, value: "industrial" },
  { label: SEGMENT_LABELS.government, value: "government" },
];

const VALID_SEGMENTS = new Set<string>(Object.keys(SEGMENT_LABELS));

function matchesSegment(item: IndustryListItem, seg: string) {
  if (!VALID_SEGMENTS.has(seg)) return true;
  return item.segments?.includes(seg as IndustrySegment) ?? false;
}

type Props = { searchParams: Promise<{ segment?: string }> };

export default async function IndustriesPage({ searchParams }: Props) {
  const { segment = "" } = await searchParams;
  const [{ data: industries }, { data: settings }] = await Promise.all([
    sanityFetch({ query: INDUSTRIES_QUERY }),
    sanityFetch({ query: SITE_SETTINGS_QUERY }),
  ]);

  const cms = industries as IndustryListItem[] | null;
  const all = cms?.length ? cms : TAXONOMY_ITEMS;
  const items = all.filter((i) => matchesSegment(i, segment));
  const phone = (settings as SiteSettings | null)?.phone;

  const activeLabel = VALID_SEGMENTS.has(segment)
    ? SEGMENT_LABELS[segment as IndustrySegment]
    : "";

  return (
    <>
      <section className="sfc-section pt-12">
        <Container>
          <div className="max-w-3xl">
            <Badge className="mb-5">Industries</Badge>
            <h1 className="text-4xl font-bold sm:text-5xl">
              {activeLabel
                ? `${activeLabel} security by industry`
                : "Security built around your industry"}
            </h1>
            <p className="mt-5 text-lg text-n-700">
              Reliant works across the full range — a single-family alarm
              system, a custom home built from the studs out, an apartment
              community, an office building, a manufacturing plant, or a
              Federal, State, Municipal, or DoD facility. Every sector faces
              different risks; explore the ones we see in yours and exactly how
              we address them.
            </p>
          </div>

          {/* Segment filter */}
          <div className="mt-8 sfc-tabs__list w-fit">
            {FILTERS.map((f) => {
              const isActive = (f.value || "") === segment;
              return (
                <Link
                  key={f.label}
                  href={
                    f.value ? `/industries?segment=${f.value}` : "/industries"
                  }
                  className={["sfc-tab", isActive && "is-active"]
                    .filter(Boolean)
                    .join(" ")}
                  aria-current={isActive ? "page" : undefined}
                >
                  {f.label}
                </Link>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="sfc-section pt-0">
        <Container>
          {items.length === 0 ? (
            <p className="text-n-700">
              No {activeLabel.toLowerCase()} industries yet — add some in the
              Studio.
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <IndustryCard key={item._id} item={item} />
              ))}
            </div>
          )}
        </Container>
      </section>

      <CtaBanner phone={phone} />
    </>
  );
}
