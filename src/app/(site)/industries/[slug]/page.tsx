import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { sanityFetch } from "@/sanity/lib/live";
import { client } from "@/sanity/lib/client";
import { INDUSTRY_QUERY, INDUSTRY_SLUGS_QUERY } from "@/sanity/lib/queries";
import type { Industry } from "@/sanity/lib/types";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Card, CardIcon } from "@/components/ui/Card";
import { SanityImage } from "@/components/ui/SanityImage";
import { CtaBanner } from "@/components/sections/CtaBanner";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await client
    .withConfig({ useCdn: false })
    .fetch<{ slug: string }[]>(INDUSTRY_SLUGS_QUERY);
  return slugs.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { data } = await sanityFetch({
    query: INDUSTRY_QUERY,
    params: { slug },
    stega: false,
  });
  const ind = data as Industry | null;
  if (!ind) return {};
  return {
    title: `${ind.name} Security`,
    description: ind.summary,
  };
}

export default async function IndustryPage({ params }: Props) {
  const { slug } = await params;
  const { data } = await sanityFetch({
    query: INDUSTRY_QUERY,
    params: { slug },
  });
  const ind = data as Industry | null;
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

            <div className="mt-6 flex items-center gap-3">
              {ind.icon && (
                <span className="sfc-card__icon" aria-hidden>
                  {ind.icon}
                </span>
              )}
              <Badge>Industry</Badge>
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
          </div>
        </Container>
      </section>

      {/* Threats + Solutions */}
      <section className="sfc-section pt-0">
        <Container>
          <div className="mx-auto grid max-w-4xl gap-10 md:grid-cols-2">
            {ind.threats?.length ? (
              <div>
                <h2 className="mb-5 text-2xl font-bold">Threats &amp; risks</h2>
                <ul className="space-y-4">
                  {ind.threats.map((t) => (
                    <li key={t._key}>
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

            {ind.solutions?.length ? (
              <div>
                <h2 className="mb-5 text-2xl font-bold">How we solve it</h2>
                <ul className="space-y-4">
                  {ind.solutions.map((s) => (
                    <li key={s._key}>
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
          {ind.services?.length ? (
            <div className="mx-auto mt-14 max-w-4xl">
              <h2 className="mb-6 text-2xl font-bold">Services for {ind.name}</h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {ind.services.map((s) => (
                  <Link key={s._id} href={`/services/${s.slug}`}>
                    <Card interactive className="h-full">
                      <CardIcon>{s.icon ?? "🛡️"}</CardIcon>
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
