import type { Metadata } from "next";
import Link from "next/link";
import { IconCheck, IconArrowRight } from "@tabler/icons-react";
import { sanityFetch } from "@/sanity/lib/live";
import { SERVICES_QUERY, SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";
import type { Service, SiteSettings, SanityImage } from "@/sanity/lib/types";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import {
  ServiceIcon,
  isServiceIconKey,
  type ServiceIconKey,
} from "@/components/ui/ServiceIcon";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { SERVICE_CATEGORIES } from "@/content/services";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Alarm systems, video surveillance, smart home & access control, network cabling, cyber security, and managed IT from Reliant Security.",
};

/* ------------------------------------------------------------------ */
/*  Merge the built-in taxonomy with any Sanity `service` documents.   */
/*  Sanity values win when present; the taxonomy fills every gap so the */
/*  page is fully populated even before the CMS has content.           */
/* ------------------------------------------------------------------ */

type DisplayService = {
  slug: string;
  title: string;
  iconKey: ServiceIconKey;
  icon?: string;
  summary: string;
  features: string[];
  heroImage?: SanityImage;
};

type DisplayCategory = {
  slug: string;
  title: string;
  iconKey: ServiceIconKey;
  blurb: string;
  services: DisplayService[];
};

function resolveIconKey(
  sanityKey: string | undefined,
  fallback: ServiceIconKey,
): ServiceIconKey {
  return isServiceIconKey(sanityKey) ? sanityKey : fallback;
}

function buildCategories(sanity: Service[]): DisplayCategory[] {
  const bySlug = new Map(sanity.map((s) => [s.slug, s]));
  const usedSlugs = new Set<string>();

  const categories: DisplayCategory[] = SERVICE_CATEGORIES.map((cat) => ({
    slug: cat.slug,
    title: cat.title,
    iconKey: cat.iconKey,
    blurb: cat.blurb,
    services: cat.services.map((svc) => {
      const cms = bySlug.get(svc.slug);
      if (cms) usedSlugs.add(svc.slug);
      return {
        slug: svc.slug,
        title: cms?.title ?? svc.title,
        iconKey: resolveIconKey(cms?.iconKey, svc.iconKey),
        icon: cms?.icon,
        summary: cms?.summary || svc.summary,
        features: cms?.features?.length ? cms.features : svc.features,
        heroImage: cms?.heroImage,
      };
    }),
  }));

  // Fold any CMS-authored services that aren't in the taxonomy into their
  // chosen category (falling back to "Additional Services").
  const byCatSlug = new Map(categories.map((c) => [c.slug, c]));
  for (const s of sanity) {
    if (usedSlugs.has(s.slug)) continue;
    const target =
      (s.category && byCatSlug.get(s.category)) ||
      byCatSlug.get("additional-services")!;
    target.services.push({
      slug: s.slug,
      title: s.title,
      iconKey: resolveIconKey(s.iconKey, "shield-check"),
      icon: s.icon,
      summary: s.summary,
      features: s.features ?? [],
      heroImage: s.heroImage,
    });
  }

  return categories.filter((c) => c.services.length > 0);
}

/* ------------------------------------------------------------------ */

function ServiceCard({ service }: { service: DisplayService }) {
  return (
    <Link
      id={service.slug}
      href={`/services/${service.slug}`}
      className="sfc-card sfc-card--interactive flex h-full scroll-mt-28 flex-col"
    >
      <div className="relative">
        <ImagePlaceholder
          image={service.heroImage}
          sizes="(min-width: 1024px) 540px, (min-width: 640px) 45vw, 90vw"
        />
        <span
          className="sfc-card__icon absolute -bottom-5 left-4"
          aria-hidden="true"
        >
          {isServiceIconKey(service.iconKey) ? (
            <ServiceIcon name={service.iconKey} size={26} />
          ) : (
            <span>{service.icon ?? "🛡️"}</span>
          )}
        </span>
      </div>

      <h3 className="mt-8 text-xl font-semibold">{service.title}</h3>
      <p className="mt-2 text-n-700">{service.summary}</p>

      {service.features.length > 0 && (
        <ul className="mt-5 space-y-2 text-n-700">
          {service.features.map((f) => (
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
      )}

      <span className="mt-auto inline-flex items-center gap-1 pt-6 text-sm font-semibold text-brand-press">
        Explore {service.title}
        <IconArrowRight size={16} stroke={2} aria-hidden />
      </span>
    </Link>
  );
}

export default async function ServicesPage() {
  const [{ data: services }, { data: settings }] = await Promise.all([
    sanityFetch({ query: SERVICES_QUERY }),
    sanityFetch({ query: SITE_SETTINGS_QUERY }),
  ]);

  const categories = buildCategories((services as Service[]) ?? []);
  const phone = (settings as SiteSettings | null)?.phone;

  return (
    <>
      {/* Hero */}
      <section className="sfc-section pt-12">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="max-w-2xl">
              <Badge className="mb-5">Our services</Badge>
              <h1 className="text-4xl font-bold sm:text-5xl">
                Protection for every corner of your world
              </h1>
              <p className="mt-5 text-lg text-n-700">
                From a single smart lock to a fully monitored multi-site system,
                we design, install, and support security that fits — backed by
                24/7 monitoring and a local team that answers the phone.
              </p>
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
              ratio="4 / 3"
              label="Hero image"
              className="w-full"
              priority
              sizes="(min-width: 1024px) 480px, 100vw"
            />
          </div>

          {/* Category quick-jump */}
          <nav
            aria-label="Service categories"
            className="mt-12 flex flex-wrap gap-2.5"
          >
            {categories.map((cat) => (
              <a
                key={cat.slug}
                href={`#${cat.slug}`}
                className="inline-flex items-center gap-2 rounded-[var(--radius-pill)] bg-surface-raised px-4 py-2 text-sm font-semibold text-n-700 transition-colors hover:text-ink"
                style={{ boxShadow: "var(--shadow-soft-1)" }}
              >
                <span className="text-brand-press">
                  <ServiceIcon name={cat.iconKey} size={18} />
                </span>
                {cat.title}
              </a>
            ))}
          </nav>
        </Container>
      </section>

      {/* Category sections */}
      {categories.map((cat) => (
        <section
          key={cat.slug}
          id={cat.slug}
          className="sfc-section scroll-mt-24 pt-0"
        >
          <Container>
            <div className="mb-8 flex items-start gap-4">
              <span className="sfc-card__icon flex-none" aria-hidden="true">
                <ServiceIcon name={cat.iconKey} size={26} />
              </span>
              <div className="max-w-2xl">
                <h2 className="text-2xl font-bold sm:text-3xl">{cat.title}</h2>
                <p className="mt-2 text-n-700">{cat.blurb}</p>
              </div>
            </div>

            <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2">
              {cat.services.map((service) => (
                <ServiceCard key={service.slug} service={service} />
              ))}
            </div>
          </Container>
        </section>
      ))}

      <CtaBanner phone={phone} />
    </>
  );
}
