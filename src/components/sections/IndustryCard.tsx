import Link from "next/link";
import { IconArrowRight } from "@tabler/icons-react";
import { Card, CardIcon } from "@/components/ui/Card";
import type { IndustryListItem } from "@/sanity/lib/types";

export function IndustryCard({ item }: { item: IndustryListItem }) {
  return (
    <Link href={`/industries/${item.slug}`} className="block">
      <Card interactive className="flex h-full flex-col">
        <CardIcon>{item.icon ?? "🏢"}</CardIcon>
        <h3 className="mt-5 text-xl font-semibold">{item.name}</h3>
        <p className="mt-2 flex-1 text-n-700">{item.summary}</p>
        <span className="mt-5 inline-flex items-center gap-1 font-semibold text-brand-press">
          Threats &amp; solutions
          <IconArrowRight size={16} stroke={2} aria-hidden />
        </span>
      </Card>
    </Link>
  );
}
