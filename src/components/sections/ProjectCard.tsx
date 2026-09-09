import Link from "next/link";
import Image from "next/image";
import { IconArrowRight } from "@tabler/icons-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SanityImage } from "@/components/ui/SanityImage";
import type { ProjectListItem } from "@/sanity/lib/types";
import { PHOTOS } from "@/content/photos";

/**
 * `localImage` is a path under /public, used by the built-in project taxonomy
 * before photography is loaded into Sanity. Callers are responsible for only
 * passing a path that exists (see `lib/publicAssets`), so a missing file falls
 * through to brand photography rather than rendering broken.
 */
export function ProjectCard({
  item,
  localImage,
}: {
  item: ProjectListItem;
  localImage?: string;
}) {
  const hasSanityImage = Boolean(item.heroImage?.asset);

  return (
    <Link href={`/projects/${item.slug}`} className="block">
      <Card interactive className="flex h-full flex-col overflow-hidden">
        <div className="-mx-7 -mt-7 mb-5">
          {hasSanityImage ? (
            <SanityImage
              value={item.heroImage!}
              width={640}
              height={400}
              className="h-48 w-full object-cover"
              sizes="(min-width: 1024px) 380px, 100vw"
            />
          ) : (
            /* Site photography stands in until a project's own shots land, so
               a row of cards never breaks on an empty well. */
            <Image
              src={localImage ?? PHOTOS.installCommercial.src}
              alt={localImage ? "" : PHOTOS.installCommercial.alt}
              width={640}
              height={400}
              className="h-48 w-full object-cover"
              sizes="(min-width: 1024px) 380px, 100vw"
            />
          )}
        </div>

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
