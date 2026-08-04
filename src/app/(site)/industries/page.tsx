import type { Metadata } from "next";
import Link from "next/link";
import { sanityFetch } from "@/sanity/lib/live";
import { INDUSTRIES_QUERY, SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";
import type {
  IndustryListItem,
  IndustrySegment,
  SiteSettings,
} from "@/sanity/lib/types";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { IndustryCard } from "@/components/sections/IndustryCard";
import { CtaBanner } from "@/components/sections/CtaBanner";

export const metadata: Metadata = {
  title: "Industries",
  description:
    "Commercial and residential security tailored to the threats facing retail, warehousing, healthcare, property management, and homes.",
};

// Shown until real industries exist in the Studio.
const FALLBACK: IndustryListItem[] = [
  {
    _id: "in1",
    slug: "retail",
    icon: "🏪",
    name: "Retail",
    summary:
      "Deter theft, protect staff, and monitor multiple storefronts from one place.",
    segment: "commercial",
  },
  {
    _id: "in2",
    slug: "warehousing",
    icon: "📦",
    name: "Warehousing & Logistics",
    summary:
      "Control access, secure inventory, and keep high-traffic facilities safe around the clock.",
    segment: "commercial",
  },
  {
    _id: "in3",
    slug: "healthcare",
    icon: "🏥",
    name: "Healthcare",
    summary:
      "Restrict sensitive areas and stay compliant with monitored, auditable access.",
    segment: "commercial",
  },
  {
    _id: "in4",
    slug: "property-management",
    icon: "🏢",
    name: "Property Management",
    summary:
      "Protect tenants and common areas with smart access control and surveillance.",
    segment: "both",
  },
  {
    _id: "in5",
    slug: "single-family-homes",
    icon: "🏡",
    name: "Single-Family Homes",
    summary:
      "Alarms, cameras, and smart locks that keep your household safe day and night.",
    segment: "residential",
  },
  {
    _id: "in6",
    slug: "apartments-condos",
    icon: "🏘️",
    name: "Apartments & Condos",
    summary:
      "Right-sized protection for renters and owners in multi-unit buildings.",
    segment: "residential",
  },
];

const FILTERS: { label: string; value: "" | IndustrySegment }[] = [
  { label: "All", value: "" },
  { label: "Commercial", value: "commercial" },
  { label: "Residential", value: "residential" },
];

function matchesSegment(item: IndustryListItem, seg: string) {
  if (seg !== "commercial" && seg !== "residential") return true;
  return item.segment === seg || item.segment === "both";
}

type Props = { searchParams: Promise<{ segment?: string }> };

export default async function IndustriesPage({ searchParams }: Props) {
  const { segment = "" } = await searchParams;
  const [{ data: industries }, { data: settings }] = await Promise.all([
    sanityFetch({ query: INDUSTRIES_QUERY }),
    sanityFetch({ query: SITE_SETTINGS_QUERY }),
  ]);

  const all = (industries as IndustryListItem[])?.length
    ? (industries as IndustryListItem[])
    : FALLBACK;
  const items = all.filter((i) => matchesSegment(i, segment));
  const phone = (settings as SiteSettings | null)?.phone;

  const activeLabel =
    segment === "commercial"
      ? "Commercial"
      : segment === "residential"
        ? "Residential"
        : "";

  return (
    <>
      <section className="sfc-section pt-12">
        <Container>
          <div className="max-w-2xl">
            <Badge className="mb-5">Industries</Badge>
            <h1 className="text-4xl font-bold sm:text-5xl">
              {activeLabel
                ? `${activeLabel} security by industry`
                : "Security built around your industry"}
            </h1>
            <p className="mt-5 text-lg text-n-700">
              Every sector faces different risks. Explore the threats we see in
              your industry — and exactly how Reliant addresses them.
            </p>
          </div>

          {/* Segment filter */}
          <div className="mt-8 sfc-tabs__list w-fit">
            {FILTERS.map((f) => {
              const isActive = (f.value || "") === segment;
              return (
                <Link
                  key={f.label}
                  href={f.value ? `/industries?segment=${f.value}` : "/industries"}
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
