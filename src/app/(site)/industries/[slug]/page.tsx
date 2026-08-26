import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { sanityFetch } from "@/sanity/lib/live";
import { INDUSTRY_QUERY } from "@/sanity/lib/queries";
import type { Industry } from "@/sanity/lib/types";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Card, CardIcon } from "@/components/ui/Card";
import { ServiceIcon, isServiceIconKey } from "@/components/ui/ServiceIcon";
import { SanityImage } from "@/components/ui/SanityImage";
import { CtaBanner } from "@/components/sections/CtaBanner";
import {
  ALL_INDUSTRY_SLUGS,
  SEGMENT_LABELS,
  findIndustryBySlug,
  type TaxonomyIndustry,
} from "@/content/industries";
import { findServiceBySlug } from "@/content/services";

type Props = { params: Promise<{ slug: string }> };

/**
 * Static params come from the built-in taxonomy rather than the CMS, so every
 * industry card on the index links somewhere real even before Sanity has any
 * `industry` documents. CMS-only industries are still rendered on demand.
 */
export function generateStaticParams() {
  return ALL_INDUSTRY_SLUGS.map((slug) => ({ slug }));
}

/** Shape the page renders, whichever source it came from. */
type DisplayIndustry = {
  name: string;
  iconKey?: string;
  summary: string;
  segments: string[];
  overview: string[];
  threats: { key: string; title: string; description?: string }[];
  solutions: { key: string; title: string; description?: string }[];
  services: {
    key: string;
    slug: string;
    title: string;
    icon?: string;
    summary?: string;
  }[];
  heroImage?: Industry["heroImage"];
};

/** Sanity values win field by field; the taxonomy fills every gap. */
function merge(
  cms: Industry | null,
  base: TaxonomyIndustry | undefined,
): DisplayIndustry | null {
  if (!cms && !base) return null;

  const threats = cms?.threats?.length
    ? cms.threats.map((t) => ({
        key: t._key,
        title: t.title,
        description: t.description,
      }))
    : (base?.threats ?? []).map((t, i) => ({ key: `t${i}`, ...t }));

  const solutions = cms?.solutions?.length
    ? cms.solutions.map((s) => ({
        key: s._key,
        title: s.title,
        description: s.description,
      }))
    : (base?.solutions ?? []).map((s, i) => ({ key: `s${i}`, ...s }));

  const services = cms?.services?.length
    ? cms.services.map((s) => ({
        key: s._id,
        slug: s.slug,
        title: s.title,
        icon: s.icon,
        summary: s.summary,
      }))
    : (base?.serviceSlugs ?? []).flatMap((slug) => {
        const match = findServiceBySlug(slug);
        return match
          ? [
              {
                key: slug,
                slug,
                title: match.service.title,
                summary: match.service.summary,
              },
            ]
          : [];
      });

  return {
    name: cms?.name ?? base!.name,
    iconKey: cms?.iconKey ?? base?.iconKey,
    summary: cms?.summary || base?.summary || "",
    segments: (cms?.segments?.length ? cms.segments : base?.segments) ?? [],
    overview: base?.overview ?? [],
    threats,
    solutions,
    services,
    heroImage: cms?.heroImage,
  };
}

async function getIndustry(slug: string) {
  const { data } = await sanityFetch({ query: INDUSTRY_QUERY, params: { slug } });
  return merge(data as Industry | null, findIndustryBySlug(slug));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const ind = await getIndustry(slug);
  if (!ind) return {};
  return {
    title: `${ind.name} Security`,
    description: ind.summary,
  };
}

export default async function IndustryPage({ params }: Props) {
  const { slug } = await params;
  const ind = await getIndustry(slug);
  if (!ind) notFound();

  return (
    <>
      <section className="sfc-section pt-12">
        <Container>
          <div className="mx-auto max-w-4xl">
            <Link
              href="/industries"
              className="text-sm text-n-500 transition-colors hover:text-ink"
            >
              ← All industries
            </Link>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="sfc-card__icon" aria-hidden>
                <ServiceIcon
                  name={isServiceIconKey(ind.iconKey) ? ind.iconKey : "building"}
                  size={26}
                />
              </span>
              {ind.segments.length ? (
                ind.segments.map((seg) => (
                  <Badge key={seg}>
                    {SEGMENT_LABELS[seg as keyof typeof SEGMENT_LABELS] ?? seg}
                  </Badge>
                ))
              ) : (
                <Badge>Industry</Badge>
              )}
            </div>

            <h1 className="mt-4 text-4xl font-bold sm:text-5xl">
              {ind.name} security
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-n-700">{ind.summary}</p>

            {ind.heroImage?.asset && (
              <div className="mt-8">
                <SanityImage
                  value={ind.heroImage}
                  width={1024}
                  height={520}
                  priority
                  className="w-full rounded-[var(--radius-xl)] object-cover"
                  sizes="(min-width: 768px) 896px, 100vw"
                />
              </div>
            )}

            {ind.overview.length > 0 && (
              <div className="mt-8 space-y-4 text-lg leading-relaxed text-n-700">
                {ind.overview.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* Threats + Solutions */}
      <section className="sfc-section pt-0">
        <Container>
          <div className="mx-auto grid max-w-4xl gap-10 md:grid-cols-2">
            {ind.threats.length ? (
              <div>
                <h2 className="mb-5 text-2xl font-bold">Threats &amp; risks</h2>
                <ul className="space-y-4">
                  {ind.threats.map((t) => (
                    <li key={t.key}>
                      <Card>
                        <h3 className="font-semibold">{t.title}</h3>
                        {t.description && (
                          <p className="mt-1 text-n-700">{t.description}</p>
                        )}
                      </Card>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {ind.solutions.length ? (
              <div>
                <h2 className="mb-5 text-2xl font-bold">How we solve it</h2>
                <ul className="space-y-4">
                  {ind.solutions.map((s) => (
                    <li key={s.key}>
                      <Card>
                        <div className="flex items-start gap-3">
                          <span aria-hidden className="mt-0.5 text-brand">
                            ✓
                          </span>
                          <div>
                            <h3 className="font-semibold">{s.title}</h3>
                            {s.description && (
                              <p className="mt-1 text-n-700">{s.description}</p>
                            )}
                          </div>
                        </div>
                      </Card>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          {/* Related services */}
          {ind.services.length ? (
            <div className="mx-auto mt-14 max-w-4xl">
              <h2 className="mb-6 text-2xl font-bold">
                Services for {ind.name}
              </h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {ind.services.map((s) => (
                  <Link key={s.key} href={`/services/${s.slug}`}>
                    <Card interactive className="h-full">
                      <CardIcon>
                        <ServiceIcon
                          name={isServiceIconKey(s.icon) ? s.icon : "shield-check"}
                          size={26}
                        />
                      </CardIcon>
                      <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
                      {s.summary && (
                        <p className="mt-2 text-n-700">{s.summary}</p>
                      )}
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
        </Container>
      </section>

      <CtaBanner />
    </>
  );
}
