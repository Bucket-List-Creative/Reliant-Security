import type { Metadata } from "next";
import Link from "next/link";
import { IconCheck, IconArrowRight } from "@tabler/icons-react";
import { notFound } from "next/navigation";
import { sanityFetch } from "@/sanity/lib/live";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import {
  SERVICE_QUERY,
  SERVICE_SLUGS_QUERY,
  SITE_SETTINGS_QUERY,
} from "@/sanity/lib/queries";
import type {
  Service,
  SiteSettings,
  SanityImage,
} from "@/sanity/lib/types";
import {
  findServiceBySlug,
  getRelatedServices,
  ALL_SERVICE_SLUGS,
  SERVICE_CATEGORIES,
  type ServiceBenefit,
  type ServiceFaq,
} from "@/content/services";
import { SITE_URL, SITE_NAME } from "@/config/site";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Accordion } from "@/components/ui/Accordion";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { PortableTextContent } from "@/components/ui/PortableTextContent";
import {
  ServiceIcon,
  isServiceIconKey,
  type ServiceIconKey,
} from "@/components/ui/ServiceIcon";
import { CtaBanner } from "@/components/sections/CtaBanner";

type Props = { params: Promise<{ slug: string }> };

/* ------------------------------------------------------------------ */
/*  Resolve a service by merging Sanity data over the built-in taxonomy */
/* ------------------------------------------------------------------ */

type ResolvedService = {
  slug: string;
  title: string;
  tagline?: string;
  summary: string;
  metaDescription: string;
  iconKey: ServiceIconKey;
  icon?: string;
  categoryTitle?: string;
  categorySlug?: string;
  features: string[];
  overview: string[];
  benefits: ServiceBenefit[];
  faqs: ServiceFaq[];
  heroImage?: SanityImage;
  body?: Service["body"];
};

function categoryTitleForSlug(slug?: string): string | undefined {
  return SERVICE_CATEGORIES.find((c) => c.slug === slug)?.title;
}

function resolve(slug: string, cms: Service | null): ResolvedService | null {
  const taxo = findServiceBySlug(slug);
  if (!taxo && !cms) return null;

  const t = taxo?.service;
  const iconKey: ServiceIconKey = isServiceIconKey(cms?.iconKey)
    ? cms!.iconKey
    : (t?.iconKey ?? "shield-check");

  const summary = cms?.summary || t?.summary || "";

  return {
    slug,
    title: cms?.title ?? t?.title ?? slug,
    tagline: t?.tagline,
    summary,
    metaDescription: t?.metaDescription || summary,
    iconKey,
    icon: cms?.icon,
    categoryTitle:
      taxo?.category.title ?? categoryTitleForSlug(cms?.category),
    categorySlug: taxo?.category.slug ?? cms?.category,
    features: cms?.features?.length ? cms.features : (t?.features ?? []),
    overview: t?.overview ?? [],
    benefits: cms?.benefits?.length
      ? cms.benefits.map((b) => ({
          title: b.title,
          description: b.description ?? "",
        }))
      : (t?.benefits ?? []),
    faqs: cms?.faqs?.length
      ? cms.faqs.map((f) => ({ question: f.question, answer: f.answer }))
      : (t?.faqs ?? []),
    heroImage: cms?.heroImage,
    body: cms?.body,
  };
}

/* ------------------------------------------------------------------ */

export async function generateStaticParams() {
  const cmsSlugs = await client
    .withConfig({ useCdn: false })
    .fetch<{ slug: string }[]>(SERVICE_SLUGS_QUERY)
    .catch(() => [] as { slug: string }[]);

  const slugs = new Set<string>(ALL_SERVICE_SLUGS);
  for (const { slug } of cmsSlugs) if (slug) slugs.add(slug);
  return [...slugs].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { data } = await sanityFetch({
    query: SERVICE_QUERY,
    params: { slug },
    stega: false,
  });
  const svc = resolve(slug, data as Service | null);
  if (!svc) return {};

  const canonical = `/services/${slug}`;
  const ogImage = svc.heroImage?.asset
    ? urlFor(svc.heroImage).width(1200).height(630).fit("crop").url()
    : undefined;

  return {
    title: svc.title,
    description: svc.metaDescription,
    alternates: { canonical },
    openGraph: {
      title: `${svc.title} · ${SITE_NAME}`,
      description: svc.metaDescription,
      url: canonical,
      type: "website",
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630 }] : undefined,
    },
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const [{ data }, { data: settings }] = await Promise.all([
    sanityFetch({ query: SERVICE_QUERY, params: { slug } }),
    sanityFetch({ query: SITE_SETTINGS_QUERY }),
  ]);

  const svc = resolve(slug, data as Service | null);
  if (!svc) notFound();

  const phone = (settings as SiteSettings | null)?.phone;
  const related = getRelatedServices(slug, 3);
  const canonical = `${SITE_URL}/services/${slug}`;

  // ---- Structured data (SEO / answer engines) ----
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: svc.title,
        serviceType: svc.title,
        description: svc.metaDescription,
        url: canonical,
        provider: {
          "@type": "LocalBusiness",
          name: SITE_NAME,
          url: SITE_URL,
          ...(phone ? { telephone: phone } : {}),
        },
        ...(svc.categoryTitle ? { category: svc.categoryTitle } : {}),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          {
            "@type": "ListItem",
            position: 2,
            name: "Services",
            item: `${SITE_URL}/services`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: svc.title,
            item: canonical,
          },
        ],
      },
      ...(svc.faqs.length
        ? [
            {
              "@type": "FAQPage",
              mainEntity: svc.faqs.map((f) => ({
                "@type": "Question",
                name: f.question,
                acceptedAnswer: { "@type": "Answer", text: f.answer },
              })),
            },
          ]
        : []),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="sfc-section pt-12">
        <Container>
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="text-sm text-n-500">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <Link href="/" className="transition-colors hover:text-ink">
                  Home
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link
                  href="/services"
                  className="transition-colors hover:text-ink"
                >
                  Services
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="text-n-700">{svc.title}</li>
            </ol>
          </nav>

          <div className="mt-8 grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <div className="flex items-center gap-3">
                <span className="sfc-card__icon" aria-hidden="true">
                  <ServiceIcon name={svc.iconKey} size={26} />
                </span>
                {svc.categoryTitle && (
                  <Badge>
                    {svc.categorySlug ? (
                      <Link href={`/services#${svc.categorySlug}`}>
                        {svc.categoryTitle}
                      </Link>
                    ) : (
                      svc.categoryTitle
                    )}
                  </Badge>
                )}
              </div>

              <h1 className="mt-5 text-4xl font-bold sm:text-5xl">
                {svc.title}
              </h1>
              <p className="mt-4 max-w-xl text-lg text-n-700">{svc.summary}</p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button href="/contact" variant="primary">
                  Get a Same-Day Quote
                </Button>
                {phone && (
                  <Button href={`tel:${phone}`} variant="outline">
                    Call {phone}
                  </Button>
                )}
              </div>
            </div>

            <ImagePlaceholder
              image={svc.heroImage}
              ratio="4 / 3"
              label={`${svc.title} image`}
              className="w-full"
              width={880}
              height={660}
              priority
              sizes="(min-width: 1024px) 520px, 100vw"
            />
          </div>
        </Container>
      </section>

      {/* Overview + What's included */}
      {(svc.overview.length > 0 || svc.features.length > 0) && (
        <section className="sfc-section pt-0">
          <Container>
            <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
              {svc.overview.length > 0 && (
                <div className="sfc-prose max-w-2xl">
                  <h2 className="text-2xl font-bold sm:text-3xl">Overview</h2>
                  {svc.overview.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
              )}

              {svc.features.length > 0 && (
                <Card className="h-fit">
                  <h2 className="text-lg font-semibold">What&apos;s included</h2>
                  <ul className="mt-4 space-y-3 text-n-700">
                    {svc.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5">
                        <IconCheck
                          size={18}
                          stroke={2.5}
                          className="mt-0.5 flex-none text-brand"
                        />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              )}
            </div>
          </Container>
        </section>
      )}

      {/* Benefits */}
      {svc.benefits.length > 0 && (
        <section className="sfc-section pt-0">
          <Container>
            <h2 className="mb-8 text-2xl font-bold sm:text-3xl">
              Why choose Reliant for {svc.title.toLowerCase()}
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {svc.benefits.map((b) => (
                <Card key={b.title} className="h-full">
                  <span className="sfc-card__icon" aria-hidden="true">
                    <ServiceIcon name={svc.iconKey} size={24} />
                  </span>
                  <h3 className="mt-4 text-lg font-semibold">{b.title}</h3>
                  {b.description && (
                    <p className="mt-2 text-n-700">{b.description}</p>
                  )}
                </Card>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Optional CMS rich body */}
      {svc.body?.length ? (
        <section className="sfc-section pt-0">
          <Container>
            <div className="mx-auto max-w-2xl">
              <PortableTextContent value={svc.body} />
            </div>
          </Container>
        </section>
      ) : null}

      {/* FAQ */}
      {svc.faqs.length > 0 && (
        <section className="sfc-section pt-0" id="faq">
          <Container>
            <div className="mx-auto max-w-2xl">
              <h2 className="mb-8 text-2xl font-bold sm:text-3xl">
                {svc.title} FAQs
              </h2>
              <Accordion
                items={svc.faqs.map((f, i) => ({
                  id: `${slug}-faq-${i}`,
                  question: f.question,
                  answer: f.answer,
                }))}
              />
            </div>
          </Container>
        </section>
      )}

      {/* Related services */}
      {related.length > 0 && (
        <section className="sfc-section pt-0">
          <Container>
            <h2 className="mb-8 text-2xl font-bold sm:text-3xl">
              Related services
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <Link key={r.slug} href={`/services/${r.slug}`} className="block">
                  <Card interactive className="h-full">
                    <span className="sfc-card__icon" aria-hidden="true">
                      <ServiceIcon name={r.iconKey} size={24} />
                    </span>
                    <h3 className="mt-4 text-lg font-semibold">{r.title}</h3>
                    <p className="mt-2 text-n-700">{r.summary}</p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-press">
                      Learn more
                      <IconArrowRight size={16} stroke={2} aria-hidden />
                    </span>
                  </Card>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}

      <CtaBanner phone={phone} />
    </>
  );
}
