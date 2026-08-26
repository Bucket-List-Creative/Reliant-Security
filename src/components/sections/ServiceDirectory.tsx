import Link from "next/link";
import { IconArrowRight } from "@tabler/icons-react";
import { Container } from "@/components/ui/Container";
import { ServiceIcon } from "@/components/ui/ServiceIcon";
import { SERVICE_CATEGORIES } from "@/content/services";
import type { Service } from "@/sanity/lib/types";

/**
 * "What we protect" as a directory rather than a card grid.
 *
 * The home page was rendering one card per service. That was four while the
 * CMS was empty, but every service is now published, so it had quietly become
 * twelve cards — three rows of them, immediately after the eight-card
 * capabilities rail. This says the same thing in a single block: every service
 * is still one click away, but the section costs a fraction of the height and
 * stops the page reading as an unbroken run of boxes.
 *
 * Structure comes from the taxonomy; Sanity titles override by slug so a
 * rename in the Studio doesn't leave the home page showing a stale label.
 */
export function ServiceDirectory({
  services,
  heading = "What we protect",
  subheading = "End-to-end security and low-voltage systems, designed around how your home or facility actually operates.",
}: {
  services?: Service[];
  heading?: string;
  subheading?: string;
}) {
  const titleBySlug = new Map(
    (services ?? []).map((s) => [s.slug, s.title] as const),
  );

  return (
    <section className="sfc-section" id="services">
      <Container>
        <div className="mb-10 flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold sm:text-4xl">{heading}</h2>
            <p className="mt-4 text-lg text-n-700">{subheading}</p>
          </div>
          <Link
            href="/services"
            className="inline-flex items-center gap-1.5 font-semibold text-brand-press hover:underline"
          >
            All services
            <IconArrowRight size={16} stroke={2} aria-hidden />
          </Link>
        </div>

        <div
          className="overflow-hidden rounded-[var(--radius-xl)] bg-surface-raised"
          style={{ boxShadow: "var(--shadow-soft-3)" }}
        >
          <ul>
            {SERVICE_CATEGORIES.map((cat, i) => (
              <li
                key={cat.slug}
                className={i > 0 ? "border-t border-n-200" : undefined}
              >
                {/* Category label and its services sit side by side on desktop
                    and stack on mobile, so the labels form a clean column
                    rather than each row re-indenting. */}
                <div className="grid gap-x-8 gap-y-3 px-6 py-5 sm:px-8 md:grid-cols-[15rem_1fr] md:items-center">
                  <Link
                    href={`/services#${cat.slug}`}
                    className="group flex items-center gap-3"
                  >
                    <span
                      aria-hidden
                      className="grid size-10 flex-none place-items-center rounded-[var(--radius-sm)] bg-brand text-white"
                    >
                      <ServiceIcon name={cat.iconKey} size={20} />
                    </span>
                    <span className="font-display font-bold leading-tight tracking-tight group-hover:text-brand-press">
                      {cat.title}
                    </span>
                  </Link>

                  <ul className="flex flex-wrap gap-2">
                    {cat.services.map((svc) => (
                      <li key={svc.slug}>
                        <Link
                          href={`/services/${svc.slug}`}
                          className="inline-flex rounded-[var(--radius-pill)] bg-surface px-3.5 py-2 text-sm font-medium text-n-700 transition-colors hover:bg-brand hover:text-white"
                        >
                          {titleBySlug.get(svc.slug) ?? svc.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
