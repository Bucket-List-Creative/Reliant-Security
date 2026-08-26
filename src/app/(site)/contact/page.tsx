import type { Metadata } from "next";
import type { ReactNode } from "react";
import {
  IconPhone,
  IconMail,
  IconMapPin,
  IconClock,
  IconShieldCheck,
} from "@tabler/icons-react";
import { sanityFetch } from "@/sanity/lib/live";
import { SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";
import type { SiteSettings, SocialLink } from "@/sanity/lib/types";
import { SITE_URL, SITE_NAME } from "@/config/site";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { ServiceAreaMap } from "@/components/ui/ServiceAreaMap";
import { ContactForm } from "@/components/sections/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Reliant Security in O'Fallon, MO for a free, same-day security assessment. Call (636) 294-5645 or send us a message.",
  alternates: { canonical: "/contact" },
};

/**
 * Sensible defaults sourced from the live Reliant site so the page is complete
 * even before Site Settings are filled in Sanity. Sanity values win when set.
 */
const FALLBACK = {
  phone: "(636) 294-5645",
  email: "customercare@secure-reliant.com",
  address: "O'Fallon, MO",
  hours: "Mon – Sun: 9:00 AM – 9:00 PM",
};

const FALLBACK_SOCIAL: SocialLink[] = [
  { _key: "fb", platform: "Facebook", url: "https://www.facebook.com/reliantllc" },
];

// Local-SEO signal: the communities Reliant serves across the St. Louis metro.
const AREAS_SERVED = [
  "O'Fallon",
  "St. Charles",
  "St. Peters",
  "St. Louis",
  "Chesterfield",
  "Wentzville",
  "Lake St. Louis",
  "Cottleville",
  "Dardenne Prairie",
  "Weldon Spring",
  "Ballwin",
  "Wildwood",
];

function MethodCard({
  icon,
  label,
  value,
  href,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  href?: string;
}) {
  const inner = (
    <>
      <span className="sfc-card__icon" aria-hidden="true">
        {icon}
      </span>
      <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-n-500">
        {label}
      </p>
      <p className="mt-1 text-lg font-medium break-words">{value}</p>
    </>
  );
  return href ? (
    <a href={href} className="sfc-card sfc-card--interactive block h-full">
      {inner}
    </a>
  ) : (
    <Card className="h-full">{inner}</Card>
  );
}

export default async function ContactPage() {
  const { data } = await sanityFetch({ query: SITE_SETTINGS_QUERY });
  const settings = data as SiteSettings | null;

  const phone = settings?.phone ?? FALLBACK.phone;
  const email = settings?.email ?? FALLBACK.email;
  const address = settings?.address ?? FALLBACK.address;
  const hours = settings?.hours ?? FALLBACK.hours;
  const emergencyPhone = settings?.emergencyPhone;
  const social = settings?.social?.length ? settings.social : FALLBACK_SOCIAL;
  const reviewsUrl = settings?.googleReviewsUrl;

  // ---- Structured data for local SEO ----
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SecuritySystemInstaller",
    name: SITE_NAME,
    url: `${SITE_URL}/contact`,
    telephone: phone,
    email,
    address: {
      "@type": "PostalAddress",
      addressLocality: "O'Fallon",
      addressRegion: "MO",
      addressCountry: "US",
    },
    areaServed: AREAS_SERVED.map((name) => ({ "@type": "City", name })),
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "09:00",
        closes: "21:00",
      },
    ],
    sameAs: social.map((s) => s.url).filter(Boolean),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="sfc-section pt-12 pb-0">
        <Container>
          <div className="max-w-2xl">
            <Badge className="mb-5">Contact us</Badge>
            <h1 className="text-4xl font-bold sm:text-5xl">
              Let&apos;s secure what matters to you
            </h1>
            <p className="mt-5 text-lg text-n-700">
              Based in O&apos;Fallon and serving the greater St.&nbsp;Louis area,
              our local team is ready to help. Reach out for a free, no-pressure
              assessment — we often turn around a detailed quote the same day.
            </p>
          </div>

          {/* Contact methods */}
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <MethodCard
              icon={<IconPhone size={24} stroke={1.75} />}
              label="Call us"
              value={phone}
              href={`tel:${phone.replace(/[^\d+]/g, "")}`}
            />
            <MethodCard
              icon={<IconMail size={24} stroke={1.75} />}
              label="Email"
              value={email}
              href={`mailto:${email}`}
            />
            <MethodCard
              icon={<IconMapPin size={24} stroke={1.75} />}
              label="Service area"
              value={address}
            />
            <MethodCard
              icon={<IconClock size={24} stroke={1.75} />}
              label="Hours"
              value={hours}
            />
          </div>
        </Container>
      </section>

      {/* Form + aside */}
      <section className="sfc-section">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <h2 className="text-2xl font-bold sm:text-3xl">
                Send us a message
              </h2>
              <p className="mt-2 mb-6 text-n-700">
                Tell us a little about your property and what you&apos;d like to
                protect. We&apos;ll follow up with a tailored plan and pricing.
              </p>
              <ContactForm />
            </div>

            <aside className="space-y-6">
              {emergencyPhone && (
                <div
                  className="rounded-[var(--radius-lg)] bg-surface-raised p-6"
                  style={{ boxShadow: "var(--shadow-soft-3)" }}
                >
                  <div className="flex items-center gap-3">
                    <span className="sfc-card__icon" aria-hidden="true">
                      <IconShieldCheck size={24} stroke={1.75} />
                    </span>
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-wide text-n-500">
                        24/7 Monitoring line
                      </p>
                      <a
                        href={`tel:${emergencyPhone.replace(/[^\d+]/g, "")}`}
                        className="text-xl font-semibold text-brand-press hover:underline"
                      >
                        {emergencyPhone}
                      </a>
                    </div>
                  </div>
                </div>
              )}

              <Card>
                <h3 className="text-lg font-semibold">Prefer to talk?</h3>
                <p className="mt-2 text-n-700">
                  Call <a href={`tel:${phone.replace(/[^\d+]/g, "")}`} className="text-brand-press hover:underline">{phone}</a>{" "}
                  during business hours, or email{" "}
                  <a href={`mailto:${email}`} className="text-brand-press hover:underline">{email}</a>.
                  We reply to most messages within one business day.
                </p>

                {(social.length > 0 || reviewsUrl) && (
                  <div className="mt-5 border-t border-n-200 pt-5">
                    <p className="text-sm font-semibold uppercase tracking-wide text-n-500">
                      Follow &amp; review
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2.5">
                      {social.map((s) =>
                        s.url ? (
                          <a
                            key={s._key ?? s.platform}
                            href={s.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center rounded-[var(--radius-pill)] bg-surface px-4 py-2 text-sm font-medium text-n-700 transition-colors hover:text-ink"
                            style={{ boxShadow: "var(--shadow-soft-1)" }}
                          >
                            {s.platform ?? "Social"}
                          </a>
                        ) : null,
                      )}
                      {reviewsUrl && (
                        <a
                          href={reviewsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center rounded-[var(--radius-pill)] bg-surface px-4 py-2 text-sm font-medium text-n-700 transition-colors hover:text-ink"
                          style={{ boxShadow: "var(--shadow-soft-1)" }}
                        >
                          Google Reviews
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </Card>
            </aside>
          </div>
        </Container>
      </section>

      {/* Map + areas served */}
      <section className="sfc-section pt-0">
        <Container>
          <div className="mb-8 max-w-2xl">
            <h2 className="text-2xl font-bold sm:text-3xl">
              Proudly serving O&apos;Fallon &amp; the greater St.&nbsp;Louis area
            </h2>
            <p className="mt-2 text-n-700">
              Local, licensed, and responsive — with technicians who know the
              communities they protect.
            </p>
          </div>

          <ServiceAreaMap height={480} />
        </Container>
      </section>
    </>
  );
}
