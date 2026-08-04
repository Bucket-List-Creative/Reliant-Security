import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import type { SiteSettings } from "@/sanity/lib/types";

const SITEMAP = [
  { href: "/services", label: "Services" },
  { href: "/industries", label: "Industries" },
  { href: "/case-studies", label: "Case Studies" },
  { href: "/pricing", label: "Pricing" },
  { href: "/blog", label: "Learn" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Footer({ settings }: { settings?: SiteSettings | null }) {
  const title = settings?.title ?? "Reliant Security";
  const tagline =
    settings?.tagline ??
    "Premium home and business security with 24/7 rapid response.";

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
          </div>

          <nav aria-label="Footer">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-n-500">
              Company
            </h3>
            <ul className="space-y-2">
              {SITEMAP.map((item) => (
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

        <p className="pb-10 text-center text-sm text-n-500">
          © {new Date().getFullYear()} {title}. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}
