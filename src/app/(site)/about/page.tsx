import { FaqAccordion } from "@/components/sections/FaqAccordion";
import { ABOUT_FAQS } from "@/content/faqs";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { sanityFetch } from "@/sanity/lib/live";
import {
  SITE_SETTINGS_QUERY,
  FEATURED_PROJECTS_QUERY,
  PARTNERS_QUERY,
  TESTIMONIALS_QUERY,
  ABOUT_PAGE_QUERY,
} from "@/sanity/lib/queries";
import type {
  SiteSettings,
  ProjectListItem,
  Partner,
  Testimonial,
  AboutPageContent,
  IconCard,
} from "@/sanity/lib/types";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Card, CardIcon } from "@/components/ui/Card";
import { ServiceIcon, isServiceIconKey } from "@/components/ui/ServiceIcon";
import { TrustBar } from "@/components/sections/TrustBar";
import { PartnerGrid } from "@/components/sections/PartnerGrid";
import { ProjectsStrip } from "@/components/sections/ProjectsStrip";
import { Testimonials } from "@/components/sections/Testimonials";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { PROJECTS } from "@/content/projects";
import { publicAssetOrUndefined } from "@/lib/publicAssets";
import {
  ABOUT_DEFAULTS,
  ABOUT_DIFFERENTIATORS,
  ABOUT_CUSTOMERS,
  type PageCard,
} from "@/content/pages";
import { PHOTOS } from "@/content/photos";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { OwnerNote } from "@/components/sections/OwnerNote";

export const metadata: Metadata = buildMetadata({
  title: "About",
  description:
    "Reliant Security is a locally owned, BBB A+ accredited security and low-voltage integrator serving homes, custom homes, multi-family, commercial, industrial, and government facilities.",
  path: "/about",
});

const LOCAL_PROJECT_IMAGES = new Map(
  PROJECTS.map((p) => [p.slug, publicAssetOrUndefined(p.image)]),
);

/** Local fallback for the intro portrait; a Sanity upload takes priority. */
const INTRO_PHOTO = publicAssetOrUndefined(PHOTOS.ownerPortrait.src);

/**
 * ⚠️ Several statements below need Reliant's confirmation before launch:
 * founding year and company history, licence numbers, certifications, and
 * team/vehicle photography. Anything not yet verified is written so it stays
 * true without specifics — but the specifics are what make this page work,
 * so they should be filled in as soon as the client provides them.
 */

/**
 * Cards come from Sanity when the About page document has them, otherwise from
 * the built-in lists. Entries without a title are dropped so a half-filled row
 * in the Studio can't blank a section out.
 */
function mergeCards(
  cms: IconCard[] | undefined,
  fallback: PageCard[],
): PageCard[] {
  if (!cms?.length) return fallback;
  const usable = cms.filter((c) => c.title);
  if (!usable.length) return fallback;
  return usable.map((c) => ({
    title: c.title!,
    description: c.description ?? "",
    iconKey: isServiceIconKey(c.iconKey) ? c.iconKey : "shield-check",
  }));
}

export default async function AboutPage() {
  const [
    { data: settings },
    { data: projects },
    { data: partners },
    { data: testimonials },
  ] = await Promise.all([
    sanityFetch({ query: SITE_SETTINGS_QUERY }),
    sanityFetch({ query: FEATURED_PROJECTS_QUERY }),
    sanityFetch({ query: PARTNERS_QUERY }),
    sanityFetch({ query: TESTIMONIALS_QUERY }),
  ]);

  const { data: pageData } = await sanityFetch({ query: ABOUT_PAGE_QUERY });

  const s = settings as SiteSettings | null;
  const page = pageData as AboutPageContent | null;

  const differentiators = mergeCards(
    page?.differentiators?.items,
    ABOUT_DIFFERENTIATORS,
  );
  const customers = mergeCards(page?.customers?.items, ABOUT_CUSTOMERS);

  return (
    <>
      {/* Intro */}
      <section className="sfc-section pt-12">
        <Container>
          <div className="grid items-start gap-10 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="max-w-3xl">
              <Badge className="mb-5">{page?.badge || ABOUT_DEFAULTS.badge}</Badge>
              <h1 className="text-4xl font-bold sm:text-5xl">
                {page?.heading || ABOUT_DEFAULTS.heading}
              </h1>
              <div className="mt-5 space-y-4 text-lg leading-relaxed text-n-700">
                <p>
                  Reliant Security is a locally owned security and low-voltage
                  integrator based in O&apos;Fallon, Missouri. We design,
                  install, service, and monitor systems for homes, custom
                  homes, multi-family communities, commercial buildings,
                  industrial plants, and government facilities.
                </p>
                <p>
                  Most companies pick a lane. Residential alarm dealers
                  don&apos;t pull fiber across a manufacturing campus, and
                  commercial contractors aren&apos;t interested in a house.
                  Reliant does both — the same technicians, the same design
                  discipline, and the same standard of finish whether it&apos;s
                  four sensors and a doorbell camera or site-wide surveillance,
                  access control, and a fiber backbone tying six buildings
                  together.
                </p>
                <p>
                  That range is deliberate. It means we can start with a
                  customer on their home, grow with their business, and still
                  be the right call when they need a specified, compliant
                  installation for a public-sector project.
                </p>
              </div>
            </div>

            {/* Our own crew and truck — the "locally owned" claim, shown
                rather than asserted. */}
            <ImagePlaceholder
              image={page?.introImage}
              src={INTRO_PHOTO}
              alt={PHOTOS.ownerPortrait.alt}
              aspectClassName="aspect-[16/10] sm:aspect-[3/2] lg:aspect-[4/5]"
              className="w-full lg:sticky lg:top-28"
              width={1000}
              height={1250}
              priority
              sizes="(min-width: 1024px) 420px, 100vw"
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

      {/* What makes us different */}
      <section className="sfc-section" id="what-makes-us-different">
        <Container>
          <div className="mb-12 max-w-2xl">
            <h2 className="text-3xl font-bold sm:text-4xl">
              {page?.differentiators?.heading || ABOUT_DEFAULTS.differentiators.heading}
            </h2>
            <p className="mt-4 text-lg text-n-700">
              {page?.differentiators?.subheading || ABOUT_DEFAULTS.differentiators.subheading}
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {differentiators.map((d) => (
              <Card key={d.title} className="sfc-card--tint flex h-full flex-col">
                <div className="flex items-center gap-4">
                  <CardIcon>
                    <ServiceIcon name={d.iconKey} size={26} />
                  </CardIcon>
                  <h3 className="text-lg font-semibold leading-snug">
                    {d.title}
                  </h3>
                </div>
                <p className="mt-4 flex-1 text-[0.9rem] leading-relaxed">
                  {d.description}
                </p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* A note from Reliant — editable in Sanity under Site settings */}
      <OwnerNote note={page?.ownerNote} />

      {/* Who we serve */}
      <section className="sfc-section pt-0" id="who-we-serve">
        <Container>
          <div className="mb-12 max-w-2xl">
            <h2 className="text-3xl font-bold sm:text-4xl">
              {page?.customers?.heading || ABOUT_DEFAULTS.customers.heading}
            </h2>
            <p className="mt-4 text-lg text-n-700">
              {page?.customers?.subheading || ABOUT_DEFAULTS.customers.subheading}
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {customers.map((c) => (
              <Card
                key={c.title}
                className="sfc-card--solid flex h-full flex-col items-center text-center"
              >
                <CardIcon>
                  <ServiceIcon name={c.iconKey} size={26} />
                </CardIcon>
                <h3 className="mt-5 text-lg font-semibold">{c.title}</h3>
                <p className="mt-2.5 flex-1 text-[0.9rem] leading-relaxed">
                  {c.description}
                </p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Featured work */}
      <ProjectsStrip
        projects={projects as ProjectListItem[]}
        localImageBySlug={LOCAL_PROJECT_IMAGES}
        heading="Featured work"
        subheading="A sample of the installations we've delivered — with more added as projects wrap."
      />

      {/* Technology partners */}
      <PartnerGrid partners={partners as Partner[]} />

      {/* Testimonials */}
      <Testimonials
        testimonials={testimonials as Testimonial[]}
        heading="What our customers say"
      />

      <FaqAccordion faqs={ABOUT_FAQS} heading="About Reliant FAQs" />

      <CtaBanner phone={s?.phone} />
    </>
  );
}
