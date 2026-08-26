import Link from "next/link";
import { IconArrowRight } from "@tabler/icons-react";
import { Card, CardIcon } from "@/components/ui/Card";
import { ServiceIcon, isServiceIconKey } from "@/components/ui/ServiceIcon";
import type { IndustryListItem } from "@/sanity/lib/types";
import { SEGMENT_LABELS } from "@/content/industries";

/**
 * Three aligned zones — header (icon + segment), body, footer link — with the
 * body flexed so the "Threats & solutions" line sits on the same baseline
 * across the row regardless of how long each summary runs.
 */
export function IndustryCard({ item }: { item: IndustryListItem }) {
  return (
    <Link href={`/industries/${item.slug}`} className="block">
      <Card interactive className="sfc-card--tint flex h-full flex-col">
        <div className="flex items-center justify-between gap-3">
          <CardIcon>
            <ServiceIcon
              name={isServiceIconKey(item.iconKey) ? item.iconKey : "building"}
              size={26}
            />
          </CardIcon>
          {item.segments?.length ? (
            <span className="rounded-[var(--radius-pill)] bg-white/70 px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-wide text-brand-press">
              {SEGMENT_LABELS[item.segments[0]]}
            </span>
          ) : null}
        </div>

        <h3 className="mt-5 text-lg font-semibold leading-snug">{item.name}</h3>
        <p className="mt-2.5 flex-1 text-[0.9rem] leading-relaxed">
          {item.summary}
        </p>

        <span className="mt-5 inline-flex items-center gap-1.5 border-t border-brand/15 pt-4 text-sm font-semibold text-brand-press">
          Threats &amp; solutions
          <IconArrowRight size={16} stroke={2} aria-hidden />
        </span>
      </Card>
    </Link>
  );
}
