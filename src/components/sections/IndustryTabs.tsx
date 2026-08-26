"use client";

import Link from "next/link";
import { IconArrowRight } from "@tabler/icons-react";
import { Container } from "@/components/ui/Container";
import { Tabs } from "@/components/ui/Tabs";
import { ServiceIcon, isServiceIconKey } from "@/components/ui/ServiceIcon";
import {
  INDUSTRIES,
  SEGMENT_LABELS,
  type IndustrySegment,
} from "@/content/industries";
import type { IndustryListItem } from "@/sanity/lib/types";

/**
 * "Industries we serve", segmented rather than laid out as a card wall.
 *
 * Ten industries as ten cards is a lot of boxes to put on a page that already
 * has plenty. Grouping them behind the four market tabs shows two or three at
 * a time instead of all of them, and it teaches the segment model the rest of
 * the site uses — the same four groupings appear in the navbar dropdown and as
 * the filter on /industries.
 *
 * Rows, not cards: an icon, a name, and one line, with the whole row as the
 * hit target.
 */
const SEGMENTS: IndustrySegment[] = [
  "residential",
  "commercial",
  "industrial",
  "government",
];

export function IndustryTabs({
  industries,
  heading = "Industries we serve",
  subheading = "From a single home to a manufacturing plant or a government facility — security tuned to the threats your sector actually faces.",
}: {
  industries?: IndustryListItem[];
  heading?: string;
  subheading?: string;
}) {
  // Sanity wins when populated; the taxonomy is the fallback and the source of
  // the segment groupings either way.
  const items: IndustryListItem[] = industries?.length
    ? industries
    : INDUSTRIES.map((i) => ({
        _id: `taxonomy-${i.slug}`,
        slug: i.slug,
        name: i.name,
        iconKey: i.iconKey,
        summary: i.summary,
        segments: i.segments,
      }));

  const tabs = SEGMENTS.map((segment) => {
    const inSegment = items.filter((i) => i.segments?.includes(segment));
    return {
      id: segment,
      label: SEGMENT_LABELS[segment],
      content: (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {inSegment.map((item) => (
            <Link
              key={item._id}
              href={`/industries/${item.slug}`}
              className="group flex items-start gap-3.5 rounded-[var(--radius-lg)] bg-surface-raised p-4 transition-all hover:-translate-y-0.5"
              style={{ boxShadow: "var(--shadow-soft-2)" }}
            >
              <span
                aria-hidden
                className="grid size-11 flex-none place-items-center rounded-[var(--radius-sm)] bg-brand text-white"
              >
                <ServiceIcon
                  name={isServiceIconKey(item.iconKey) ? item.iconKey : "building"}
                  size={22}
                />
              </span>
              <span className="min-w-0">
                <span className="flex items-center gap-1.5 font-semibold leading-snug group-hover:text-brand-press">
                  {item.name}
                  <IconArrowRight
                    size={15}
                    stroke={2.2}
                    aria-hidden
                    className="flex-none opacity-0 transition-opacity group-hover:opacity-100"
                  />
                </span>
                <span className="mt-1 block text-sm leading-snug text-n-700">
                  {item.summary}
                </span>
              </span>
            </Link>
          ))}
        </div>
      ),
    };
  });

  return (
    <section className="sfc-section" id="industries">
      <Container>
        <div className="mb-8 flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold sm:text-4xl">{heading}</h2>
            <p className="mt-4 text-lg text-n-700">{subheading}</p>
          </div>
          <Link
            href="/industries"
            className="inline-flex items-center gap-1.5 font-semibold text-brand-press hover:underline"
          >
            All industries
            <IconArrowRight size={16} stroke={2} aria-hidden />
          </Link>
        </div>

        <Tabs tabs={tabs} />
      </Container>
    </section>
  );
}
