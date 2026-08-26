import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { sanityFetch } from "@/sanity/lib/live";
import { PROJECT_QUERY } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import type { Project } from "@/sanity/lib/types";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { SanityImage } from "@/components/ui/SanityImage";
import { PortableTextContent } from "@/components/ui/PortableTextContent";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { ALL_PROJECT_SLUGS, findProjectBySlug } from "@/content/projects";
import { existingPublicAssets, publicAssetOrUndefined } from "@/lib/publicAssets";
import { SITE_URL } from "@/config/site";

type Props = { params: Promise<{ slug: string }> };

/**
 * Slugs come from the built-in taxonomy so every project card links somewhere
 * real before Sanity has `project` documents. CMS-only projects still render
 * on demand.
 */
export function generateStaticParams() {
  return ALL_PROJECT_SLUGS.map((slug) => ({ slug }));
}

async function getProject(slug: string) {
  const { data } = await sanityFetch({ query: PROJECT_QUERY, params: { slug } });
  const cms = data as Project | null;
  const base = findProjectBySlug(slug);
  if (!cms && !base) return null;
  return { cms, base };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const found = await getProject(slug);
  if (!found) return {};
  const { cms, base } = found;
  return {
    title: cms?.title ?? base!.title,
    description: cms?.summary || base?.summary,
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const found = await getProject(slug);
  if (!found) notFound();
  const { cms, base } = found;

  const title = cms?.title ?? base!.title;
  const summary = cms?.summary || base?.summary || "";
  const client = cms?.client ?? base?.client;
  const industry = cms?.industry ?? base?.industry;
  const location = cms?.location ?? base?.location;
  const equipment = cms?.equipment?.length ? cms.equipment : base?.equipment;

  // Local project photography, used until images are loaded into Sanity.
  const localHero = publicAssetOrUndefined(base?.image);
  const localGallery = existingPublicAssets(base?.gallery);

  const heroImageUrl = cms?.heroImage?.asset
    ? urlFor(cms.heroImage).width(1200).height(630).url()
    : localHero
      ? `${SITE_URL}${localHero}`
      : undefined;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: summary,
    ...(heroImageUrl && { image: heroImageUrl }),
    ...(cms?.publishedAt && { datePublished: cms.publishedAt }),
    author: { "@type": "Organization", name: "Reliant Security" },
    publisher: { "@type": "Organization", name: "Reliant Security" },
    ...(industry && { about: industry }),
  };

  // Taxonomy services are resolved from slugs; CMS ones come as references.
  const services = cms?.services?.length
    ? cms.services.map((s) => ({
        key: s._id,
        slug: s.slug,
        title: s.title,
        icon: s.icon,
      }))
    : [];

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
              href="/projects"
              className="text-sm text-n-500 transition-colors hover:text-ink"
            >
              ← All projects
            </Link>

            <div className="mt-6 flex flex-wrap items-center gap-2">
              {industry && <Badge>{industry}</Badge>}
              {client && <span className="text-sm text-n-500">{client}</span>}
              {location && (
                <span className="text-sm text-n-500">· {location}</span>
              )}
            </div>

            <h1 className="mt-4 text-4xl font-bold sm:text-5xl">{title}</h1>
            <p className="mt-4 max-w-2xl text-lg text-n-700">{summary}</p>

            {cms?.heroImage?.asset ? (
              <div className="mt-8">
                <SanityImage
                  value={cms.heroImage}
                  width={1024}
                  height={560}
                  priority
                  className="w-full rounded-[var(--radius-xl)] object-cover"
                  sizes="(min-width: 768px) 896px, 100vw"
                />
              </div>
            ) : localHero ? (
              <div className="mt-8 overflow-hidden rounded-[var(--radius-xl)]">
                <Image
                  src={localHero}
                  alt={`${client ?? title} — Reliant Security project`}
                  width={1024}
                  height={560}
                  priority
                  className="w-full object-cover"
                  sizes="(min-width: 768px) 896px, 100vw"
                />
              </div>
            ) : null}

            {/* Results */}
            {cms?.results?.length ? (
              <div
                className="mt-10 grid grid-cols-2 gap-6 rounded-[var(--radius-xl)] bg-surface-raised px-8 py-8 lg:grid-cols-4"
                style={{ boxShadow: "var(--shadow-soft-3)" }}
              >
                {cms.results.map((r) => (
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
              <div>
                <h2 className="mb-3 text-2xl font-bold">What they needed</h2>
                {cms?.challenge?.length ? (
                  <PortableTextContent value={cms.challenge} />
                ) : (
                  <div className="space-y-4 text-n-700">
                    {base?.challenge.map((p, i) => <p key={i}>{p}</p>)}
                  </div>
                )}
              </div>
              <div>
                <h2 className="mb-3 text-2xl font-bold">What we delivered</h2>
                {cms?.solution?.length ? (
                  <PortableTextContent value={cms.solution} />
                ) : (
                  <div className="space-y-4 text-n-700">
                    {base?.solution.map((p, i) => <p key={i}>{p}</p>)}
                  </div>
                )}
              </div>
            </div>

            {/* Gallery */}
            {cms?.gallery?.length ? (
              <div className="mt-12 grid gap-6 sm:grid-cols-2">
                {cms.gallery.map((img) => (
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
            ) : localGallery.length ? (
              <div className="mt-12 grid gap-6 sm:grid-cols-2">
                {localGallery.map((src) => (
                  <div
                    key={src}
                    className="overflow-hidden rounded-[var(--radius-lg)]"
                  >
                    <Image
                      src={src}
                      alt={`${client ?? title} — project photo`}
                      width={720}
                      height={480}
                      className="w-full object-cover"
                      sizes="(min-width: 640px) 440px, 100vw"
                    />
                  </div>
                ))}
              </div>
            ) : null}

            {/* Major services & equipment */}
            {equipment?.length ? (
              <Card className="mt-12">
                <h2 className="text-xl font-semibold">
                  Major services &amp; equipment
                </h2>
                <ul className="mt-4 flex flex-wrap gap-3">
                  {equipment.map((e) => (
                    <li key={e}>
                      <Badge>{e}</Badge>
                    </li>
                  ))}
                </ul>
              </Card>
            ) : null}

            {/* Related services */}
            {services.length ? (
              <Card className="mt-6">
                <h2 className="text-xl font-semibold">Services used</h2>
                <ul className="mt-4 flex flex-wrap gap-3">
                  {services.map((s) => (
                    <li key={s.key}>
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
