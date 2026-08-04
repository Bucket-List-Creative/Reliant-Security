import Link from "next/link";
import { IconArrowRight } from "@tabler/icons-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SanityImage } from "@/components/ui/SanityImage";
import type { CaseStudyListItem } from "@/sanity/lib/types";

export function CaseStudyCard({ item }: { item: CaseStudyListItem }) {
  return (
    <Link href={`/case-studies/${item.slug}`} className="block">
      <Card interactive className="flex h-full flex-col overflow-hidden">
        {item.heroImage?.asset && (
          <div className="-mx-7 -mt-7 mb-5">
            <SanityImage
              value={item.heroImage}
              width={640}
              height={400}
              className="h-48 w-full object-cover"
              sizes="(min-width: 1024px) 380px, 100vw"
            />
          </div>
        )}
        <div className="mb-3 flex flex-wrap gap-2">
          {item.industry && <Badge>{item.industry}</Badge>}
          {item.client && (
            <span className="self-center text-sm text-n-500">{item.client}</span>
          )}
        </div>
        <h3 className="text-xl font-semibold">{item.title}</h3>
        <p className="mt-2 flex-1 text-n-700">{item.summary}</p>
        <span className="mt-5 inline-flex items-center gap-1 font-semibold text-brand-press">
          View project
          <IconArrowRight size={16} stroke={2} aria-hidden />
        </span>
      </Card>
    </Link>
  );
}
