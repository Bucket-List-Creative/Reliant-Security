import Link from "next/link";
import { IconArrowRight } from "@tabler/icons-react";
import { Card, CardIcon } from "@/components/ui/Card";
import { ServiceIcon, isServiceIconKey } from "@/components/ui/ServiceIcon";
import type { IndustryListItem } from "@/sanity/lib/types";
import { SEGMENT_LABELS, type IndustrySegment } from "@/content/industries";

/**
 * Accent per segment, so the industries grid reads as grouped at a glance
 * rather than as one long run of identical grey cards. An industry spanning
 * several segments takes the first one's colour.
 */
const SEGMENT_ACCENT: Record<IndustrySegment, string> = {
  residential: "sfc-accent-green",
  commercial: "sfc-accent-blue",
  industrial: "sfc-accent-amber",
  government: "sfc-accent-violet",
};

export function IndustryCard({ item }: { item: IndustryListItem }) {
  const primary = item.segments?.[0];
  const accent = primary ? SEGMENT_ACCENT[primary] : "sfc-accent-teal";

  return (
    <Link href={`/industries/${item.slug}`} className="block">
      <Card
        interactive
        className={`sfc-card--accent ${accent} flex h-full flex-col`}
      >
        <div className="flex items-start justify-between gap-3">
          <CardIcon>
            <ServiceIcon
              name={isServiceIconKey(item.iconKey) ? item.iconKey : "building"}
              size={26}
            />
          </CardIcon>
          {item.segments?.length ? (
            <span
              className="rounded-[var(--radius-pill)] bg-white/70 px-2.5 py-1 text-[0.7rem] font-bold uppercase tracking-wide"
              style={{ color: "var(--accent)" }}
            >
              {SEGMENT_LABELS[item.segments[0]]}
            </span>
          ) : null}
        </div>

        <h3 className="mt-5 text-xl font-semibold">{item.name}</h3>
        <p className="mt-2 flex-1 text-[0.95rem] leading-relaxed text-n-700">
          {item.summary}
        </p>
        <span
          className="mt-5 inline-flex items-center gap-1 font-semibold"
          style={{ color: "var(--accent)" }}
        >
          Threats &amp; solutions
          <IconArrowRight size={16} stroke={2} aria-hidden />
        </span>
      </Card>
    </Link>
  );
}
