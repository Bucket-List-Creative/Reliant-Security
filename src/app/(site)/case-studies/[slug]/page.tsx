import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { sanityFetch } from "@/sanity/lib/live";
import { client } from "@/sanity/lib/client";
import {
  CASE_STUDY_QUERY,
  CASE_STUDY_SLUGS_QUERY,
} from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import type { CaseStudy } from "@/sanity/lib/types";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { SanityImage } from "@/components/ui/SanityImage";
import { PortableTextContent } from "@/components/ui/PortableTextContent";
import { CtaBanner } from "@/components/sections/CtaBanner";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await client
    .withConfig({ useCdn: false })
    .fetch<{ slug: string }[]>(CASE_STUDY_SLUGS_QUERY);
  return slugs.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { data } = await sanityFetch({
    query: CASE_STUDY_QUERY,
    params: { slug },
    stega: false,
  });
  const cs = data as CaseStudy | null;
  if (!cs) return {};
  return { title: cs.title, description: cs.summary };
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const { data } = await sanityFetch({
    query: CASE_STUDY_QUERY,
    params: { slug },
  });
  const cs = data as CaseStudy | null;
  if (!cs) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: cs.title,
    description: cs.summary,
    ...(cs.heroImage?.asset && {
      image: urlFor(cs.heroImage).width(1200).height(630).url(),
    }),
    datePublished: cs.publishedAt,
    author: { "@type": "Organization", name: "Reliant Security" },
    publisher: { "@type": "Organization", name: "Reliant Security" },
    ...(cs.industry && { about: cs.industry }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="sfc-section pt-12">
        <Container>
          <div className="mx-auto max-w-4xl">
            <Link
              href="/case-studies"
              className="text-sm text-n-500 transition-colors hover:text-ink"
            >
              ← All case studies
            </Link>

            <div className="mt-6 flex flex-wrap items-center gap-2">
              {cs.industry && <Badge>{cs.industry}</Badge>}
              {cs.client && (
                <span className="text-sm text-n-500">{cs.client}</span>
              )}
              {cs.location && (
                <span className="text-sm text-n-500">· {cs.location}</span>
              )}
            </div>

            <h1 className="mt-4 text-4xl font-bold sm:text-5xl">{cs.title}</h1>
            <p className="mt-4 max-w-2xl text-lg text-n-700">{cs.summary}</p>

            {cs.heroImage?.asset && (
              <div className="mt-8">
                <SanityImage
                  value={cs.heroImage}
                  width={1024}
                  height={560}
                  priority
                  className="w-full rounded-[var(--radius-xl)] object-cover"
                  sizes="(min-width: 768px) 896px, 100vw"
                />
              </div>
            )}

            {/* Results */}
            {cs.results?.length ? (
              <div
                className="mt-10 grid grid-cols-2 gap-6 rounded-[var(--radius-xl)] bg-surface-raised px-8 py-8 lg:grid-cols-4"
                style={{ boxShadow: "var(--shadow-soft-3)" }}
              >
                {cs.results.map((r) => (
                  <div key={r._key} className="text-center">
                    <div className="font-display text-3xl font-bold text-brand-press sm:text-4xl">
                      {r.value}
                    </div>
                    <div className="mt-1 text-sm text-n-700">{r.label}</div>
                  </div>
                ))}
              </div>
            ) : null}

            {/* Challenge + Solution */}
            <div className="mt-12 grid gap-10 md:grid-cols-2">
              {cs.challenge?.length ? (
                <div>
                  <h2 className="mb-3 text-2xl font-bold">The challenge</h2>
                  <PortableTextContent value={cs.challenge} />
                </div>
              ) : null}
              {cs.solution?.length ? (
                <div>
                  <h2 className="mb-3 text-2xl font-bold">Our solution</h2>
                  <PortableTextContent value={cs.solution} />
                </div>
              ) : null}
            </div>

            {/* Gallery */}
            {cs.gallery?.length ? (
              <div className="mt-12 grid gap-6 sm:grid-cols-2">
                {cs.gallery.map((img) => (
                  <SanityImage
                    key={img._key}
                    value={img}
                    width={720}
                    height={480}
                    className="w-full rounded-[var(--radius-lg)] object-cover"
                    sizes="(min-width: 640px) 440px, 100vw"
                  />
                ))}
              </div>
            ) : null}

            {/* Related services */}
            {cs.services?.length ? (
              <Card className="mt-12">
                <h2 className="text-xl font-semibold">Services used</h2>
                <ul className="mt-4 flex flex-wrap gap-3">
                  {cs.services.map((s) => (
                    <li key={s._id}>
                      <Link href={`/services/${s.slug}`}>
                        <Badge>
                          {s.icon ? `${s.icon} ` : ""}
                          {s.title}
                        </Badge>
                      </Link>
                    </li>
                  ))}
                </ul>
              </Card>
            ) : null}
          </div>
        </Container>
      </article>

      <CtaBanner />
    </>
  );
}
