import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import Link from "next/link";
import { notFound } from "next/navigation";
import { IconCheck, IconArrowRight } from "@tabler/icons-react";
import { sanityFetch } from "@/sanity/lib/live";
import {
  LOCATION_QUERY,
  SITE_SETTINGS_QUERY,
} from "@/sanity/lib/queries";
import type { LocationDoc, SiteSettings } from "@/sanity/lib/types";
import {
  LOCATIONS,
  LOCATION_SERVICES,
  findLocation,
  locationCopy,
  locationLabel,
  nearestLocations,
  milesFromHq,
} from "@/content/locations";

import {
  organizationJsonLd,
  breadcrumbJsonLd,
  jsonLdGraph,
} from "@/lib/schema";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { PortableTextContent } from "@/components/ui/PortableTextContent";
import { FaqAccordion } from "@/components/sections/FaqAccordion";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { TrustBar } from "@/components/sections/TrustBar";
import { PHOTOS } from "@/content/photos";
import { publicAssetOrUndefined } from "@/lib/publicAssets";
import { HOME_FAQS } from "@/content/faqs";

type Props = { params: Promise<{ location: string }> };

/**
 * Only the cities in `LOCATIONS` resolve here — every other root-level path
 * falls through to the 404. Without this, a dynamic segment at the root would
 * happily render a page for any URL a crawler invented.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return LOCATIONS.map((l) => ({ location: l.slug }));
}

const HERO_PHOTO = publicAssetOrUndefined(PHOTOS.truckWide.src);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { location: slug } = await params;
  const base = findLocation(slug);
  if (!base) return {};

  const { data } = await sanityFetch({
    query: LOCATION_QUERY,
    params: { slug },
    stega: false,
  });
  const cms = data as LocationDoc | null;
  const copy = locationCopy(base);

  return buildMetadata({
    title: cms?.metaTitle ?? copy.metaTitle,
    description: cms?.metaDescription ?? copy.metaDescription,
    path: `/${slug}`,
  });
}

export default async function LocationPage({ params }: Props) {
  const { location: slug } = await params;
  const base = findLocation(slug);
  if (!base) notFound();

  const [{ data }, { data: settings }] = await Promise.all([
    sanityFetch({ query: LOCATION_QUERY, params: { slug } }),
    sanityFetch({ query: SITE_SETTINGS_QUERY }),
  ]);

  const cms = data as LocationDoc | null;
  const s = settings as SiteSettings | null;
  const copy = locationCopy(base);
  const place = locationLabel(base);
  // Genuinely different per city, which is the point — see `nearestLocations`.
  const nearby = nearestLocations(base, 6);
  const miles = milesFromHq(base);

  // Local business structured data, scoped to this city — the whole point of
  // having a page per area.
  // One business serving many places: the same `@id` as the home page, with
  // this city's geo point and the surrounding communities we actually cover.
  const jsonLd = jsonLdGraph(
    organizationJsonLd({
      settings: s,
      areaServed: [base.city, ...nearby.map((l) => l.city)],
      geo: { lat: base.lat, lng: base.lng },
    }),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Areas we serve", path: "/areas-we-serve" },
      { name: place, path: `/${slug}` },
    ]),
  );


  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="sfc-section pt-12">
        <Container>
          <nav aria-label="Breadcrumb" className="mb-6 text-sm text-n-500">
            <Link href="/" className="hover:text-ink">
              Home
            </Link>
            <span className="mx-2" aria-hidden>
              /
            </span>
            <Link href="/areas-we-serve" className="hover:text-ink">
              Areas we serve
            </Link>
            <span className="mx-2" aria-hidden>
              /
            </span>
            <span className="text-n-700">{place}</span>
          </nav>

          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="max-w-2xl">
              <Badge className="mb-5">{place}</Badge>
              <h1 className="text-4xl font-bold sm:text-5xl">
                {cms?.heading ?? copy.heading}
              </h1>

              {cms?.intro?.length ? (
                <div className="sfc-prose mt-5">
                  <PortableTextContent value={cms.intro} />
                </div>
              ) : (
                <div className="mt-5 space-y-4 text-lg leading-relaxed text-n-700">
                  {copy.intro.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
              )}

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button href="/contact" variant="primary">
                  Get a Free Estimate
                </Button>
                {s?.phone && (
                  <Button href={`tel:${s.phone}`} variant="outline">
                    Call {s.phone}
                  </Button>
                )}
              </div>
            </div>

            <ImagePlaceholder
              image={cms?.heroImage}
              src={HERO_PHOTO}
              alt={PHOTOS.truckWide.alt}
              aspectClassName="aspect-[16/10] lg:aspect-[4/3]"
              className="w-full"
              width={960}
              height={720}
              priority
              sizes="(min-width: 1024px) 480px, 100vw"
            />
          </div>

          <div className="mt-10">
            <TrustBar
              bbbUrl={s?.bbbUrl}
              googleReviewsUrl={s?.googleReviewsUrl}
              angiesListUrl={s?.angiesListUrl}
            />
          </div>
        </Container>
      </section>

      {/* Services offered here */}
      <section className="sfc-section pt-0">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <Card className="h-fit">
              <h2 className="text-lg font-semibold">{copy.servicesLead}</h2>
              <ul className="mt-4 space-y-3 text-n-700">
                {LOCATION_SERVICES.map((svc) => (
                  <li key={svc.slug}>
                    <Link
                      href={`/services/${svc.slug}`}
                      className="flex items-start gap-2.5 hover:text-ink"
                    >
                      <IconCheck
                        size={18}
                        stroke={2.5}
                        className="mt-0.5 flex-none text-brand"
                        aria-hidden
                      />
                      <span>{svc.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href="/services"
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-press"
              >
                View all our services
                <IconArrowRight size={16} stroke={2} aria-hidden />
              </Link>
            </Card>

            <div className="sfc-prose max-w-2xl">
              <p>{copy.mission}</p>
            </div>
          </div>
        </Container>
      </section>

      {/* Body */}
      <section className="sfc-section pt-0">
        <Container>
          <div className="max-w-3xl">
            <h2 className="text-3xl font-bold sm:text-4xl">
              {copy.sectionHeading}
            </h2>
            {cms?.body?.length ? (
              <div className="sfc-prose mt-5">
                <PortableTextContent value={cms.body} />
              </div>
            ) : (
              <div className="mt-5 space-y-4 text-lg leading-relaxed text-n-700">
                {copy.sectionBody.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* Local context + nearby areas.
          Both are derived from real coordinates, so every city page carries a
          different set here rather than the same 29 links. */}
      <section className="sfc-section pt-0">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <Card className="h-fit">
              <h2 className="text-lg font-semibold">
                Serving {place} from O&apos;Fallon
              </h2>
              <dl className="mt-4 space-y-3 text-n-700">
                <div className="flex justify-between gap-4">
                  <dt className="text-n-500">County</dt>
                  <dd className="font-semibold">{base.county}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-n-500">From our base</dt>
                  <dd className="font-semibold">
                    about {miles} miles
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-n-500">Free estimates</dt>
                  <dd className="font-semibold">Yes</dd>
                </div>
              </dl>
            </Card>

            <div>
              <h2 className="text-2xl font-bold">
                We also cover nearby communities
              </h2>
              <p className="mt-3 text-n-700">
                The service areas closest to {place}.
              </p>
              <nav
                aria-label={`Service areas near ${place}`}
                className="mt-5 flex flex-wrap gap-2.5"
              >
                {nearby.map((l) => (
                  <Link
                    key={l.slug}
                    href={`/${l.slug}`}
                    className="inline-flex items-center rounded-[var(--radius-pill)] bg-surface-raised px-4 py-2 text-sm font-semibold text-n-700 transition-colors hover:text-ink"
                    style={{ boxShadow: "var(--shadow-soft-1)" }}
                  >
                    {locationLabel(l)}
                  </Link>
                ))}
              </nav>
              <Link
                href="/areas-we-serve"
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-press"
              >
                See every area we serve
                <IconArrowRight size={16} stroke={2} aria-hidden />
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <FaqAccordion faqs={HOME_FAQS} heading={`Common questions — ${place}`} />

      <CtaBanner
        phone={s?.phone}
        heading={copy.closingHeading}
        subheading={copy.closingBody}
      />
    </>
  );
}
