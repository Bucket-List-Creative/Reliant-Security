import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import Link from "next/link";
import { IconArrowRight } from "@tabler/icons-react";
import { sanityFetch } from "@/sanity/lib/live";
import { SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";
import type { SiteSettings } from "@/sanity/lib/types";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { ServiceAreaMap } from "@/components/ui/ServiceAreaMap";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { LOCATIONS, locationLabel } from "@/content/locations";

export const metadata: Metadata = buildMetadata({
  title: "Areas we serve",
  description:
    "Reliant Security serves homes and businesses across the greater St. Louis metro — and multi-site commercial, industrial, and government customers throughout the US.",
  path: "/areas-we-serve",
});

export default async function AreasWeServePage() {
  const { data: settings } = await sanityFetch({ query: SITE_SETTINGS_QUERY });
  const s = settings as SiteSettings | null;

  return (
    <>
      <section className="sfc-section pt-12">
        <Container>
          <div className="max-w-2xl">
            <Badge className="mb-5">Areas we serve</Badge>
            <h1 className="text-4xl font-bold sm:text-5xl">
              Local to St.&nbsp;Louis. Working nationwide.
            </h1>
            <p className="mt-5 text-lg text-n-700">
              Reliant is locally owned and operated out of
              O&apos;Fallon,&nbsp;Missouri. We install and service security,
              surveillance, access control, and low-voltage systems across the
              St.&nbsp;Louis metro — and travel nationally for multi-site
              commercial, industrial, and government customers.
            </p>
          </div>

          <div className="mt-10">
            <ServiceAreaMap height={480} />
          </div>
        </Container>
      </section>

      <section className="sfc-section pt-0">
        <Container>
          <h2 className="text-2xl font-bold sm:text-3xl">
            Communities with their own page
          </h2>
          <p className="mt-3 max-w-2xl text-n-700">
            Don&apos;t see your town? We almost certainly still cover it — give
            us a call and we&apos;ll confirm.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {LOCATIONS.map((l) => (
              <Link key={l.slug} href={`/${l.slug}`} className="block">
                <Card
                  interactive
                  className="flex items-center justify-between gap-3 py-5"
                >
                  <span className="font-semibold">{locationLabel(l)}</span>
                  <IconArrowRight
                    size={18}
                    stroke={2}
                    className="flex-none text-brand-press"
                    aria-hidden
                  />
                </Card>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <CtaBanner phone={s?.phone} />
    </>
  );
}
