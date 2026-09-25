import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { PreferredSourceButton } from "@/components/sections/PreferredSourceButton";
import { CookieSettingsButton } from "@/components/ui/CookieSettingsButton";
import { NAV_DEFAULTS } from "@/content/pages";
import type { SiteSettings, NavigationContent } from "@/sanity/lib/types";

export function Footer({
  settings,
  navigation,
}: {
  settings?: SiteSettings | null;
  navigation?: NavigationContent | null;
}) {
  // A CMS list replaces the built-in footer links entirely.
  const links =
    navigation?.footerLinks?.filter((l) => l.label && l.href) ?? [];
  const sitemap = links.length ? links : NAV_DEFAULTS.footerLinks;
  const title = settings?.title ?? "Reliant Security";
  const tagline =
    settings?.tagline ??
    "Locally owned security and low-voltage integration — residential, commercial, industrial, and government — backed by 24/7 professional monitoring.";

  return (
    <footer className="mt-8">
      <Container>
        <div
          className="mb-8 grid gap-10 rounded-t-[var(--radius-xl)] bg-surface-raised px-8 py-12 sm:grid-cols-2 lg:grid-cols-4"
          style={{ boxShadow: "var(--shadow-soft-2)" }}
        >
          <div className="lg:col-span-2">
            <Image
              src="/Images/Logo/logo-full.png"
              alt={title}
              width={493}
              height={241}
              className="h-auto w-44"
            />
            <p className="mt-4 max-w-sm text-n-700">{tagline}</p>

            {/* Google Preferred Sources — sitewide, so it's reachable from any
                page. It only pays off if readers actually click it. */}
            <div className="mt-6">
              <p className="mb-2 text-sm text-n-500">
                Follow us on Google to see Reliant first.
              </p>
              <PreferredSourceButton />
            </div>
          </div>

          <nav aria-label="Footer">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-n-500">
              Company
            </h3>
            <ul className="space-y-2">
              {sitemap.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-n-700 transition-colors hover:text-ink"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-n-500">
              Contact
            </h3>
            <ul className="space-y-2 text-n-700">
              {settings?.phone && (
                <li>
                  <a href={`tel:${settings.phone}`} className="hover:text-ink">
                    {settings.phone}
                  </a>
                </li>
              )}
              {settings?.email && (
                <li>
                  <a href={`mailto:${settings.email}`} className="hover:text-ink">
                    {settings.email}
                  </a>
                </li>
              )}
              {settings?.address && (
                <li className="whitespace-pre-line">{settings.address}</li>
              )}
              {settings?.social?.length ? (
                <li className="flex gap-3 pt-2">
                  {settings.social.map((s) =>
                    s.url ? (
                      <a
                        key={s._key}
                        href={s.url}
                        className="hover:text-ink"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {s.platform}
                      </a>
                    ) : null,
                  )}
                </li>
              ) : null}
            </ul>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 pb-10 text-center text-sm text-n-500">
          <span>
            © {new Date().getFullYear()} {title}. All rights reserved.
          </span>
          <span aria-hidden>·</span>
          {/* Consent has to be as easy to withdraw as it was to give. */}
          <CookieSettingsButton />
        </div>
      </Container>
    </footer>
  );
}
