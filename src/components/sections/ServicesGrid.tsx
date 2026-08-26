import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Card, CardIcon } from "@/components/ui/Card";
import { ServiceIcon, isServiceIconKey } from "@/components/ui/ServiceIcon";
import type { Service } from "@/sanity/lib/types";

const FALLBACK: Pick<
  Service,
  "_id" | "title" | "icon" | "iconKey" | "summary"
>[] = [
  {
    _id: "f1",
    icon: "🛡️",
    title: "Alarm Systems",
    summary:
      "Intrusion, smoke, and carbon-monoxide detection for homes and businesses, backed by 24/7 professional monitoring.",
  },
  {
    _id: "f2",
    icon: "📹",
    title: "Video Surveillance",
    summary:
      "Hardwired and wireless cameras — from a doorbell camera to site-wide industrial coverage — with recording you can review anywhere.",
  },
  {
    _id: "f3",
    icon: "🔐",
    title: "Access Control",
    summary:
      "Keyless entry, mobile credentials, and role-based permissions with a full audit trail on every door.",
  },
  {
    _id: "f4",
    icon: "🔌",
    title: "Structured Cabling & Fiber",
    summary:
      "Cat6/Cat6A, fiber, racks, and pathways — certified, labeled, and documented network infrastructure.",
  },
];

/** Rotated across the grid so a row of service cards isn't monochrome. */
const ACCENTS = [
  "sfc-accent-green",
  "sfc-accent-teal",
  "sfc-accent-violet",
  "sfc-accent-blue",
  "sfc-accent-amber",
  "sfc-accent-rose",
];

export function ServicesGrid({
  services,
  heading = "What we protect",
  subheading = "End-to-end security and low-voltage systems, designed around how your home or facility actually operates.",
  showLinks = true,
}: {
  services?: Service[];
  heading?: string;
  subheading?: string;
  showLinks?: boolean;
}) {
  const items = services?.length ? services : FALLBACK;

  return (
    <section className="sfc-section" id="services">
      <Container>
        <div className="mb-12 max-w-2xl">
          <h2 className="text-3xl font-bold sm:text-4xl">{heading}</h2>
          <p className="mt-4 text-lg text-n-700">{subheading}</p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((service, i) => {
            const inner = (
              <>
                <CardIcon>
                  {isServiceIconKey(service.iconKey) ? (
                    <ServiceIcon name={service.iconKey} size={26} />
                  ) : (
                    (service.icon ?? "🛡️")
                  )}
                </CardIcon>
                <h3 className="mt-5 text-xl font-semibold">{service.title}</h3>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-n-700">
                  {service.summary}
                </p>
              </>
            );

            const slug = "slug" in service ? service.slug : undefined;
            const cardClass = `sfc-card--accent ${ACCENTS[i % ACCENTS.length]} h-full`;

            return showLinks && slug ? (
              <Link
                key={service._id}
                href={`/services/${slug}`}
                className="block"
              >
                <Card interactive className={cardClass}>
                  {inner}
                </Card>
              </Link>
            ) : (
              <Card key={service._id} interactive className={cardClass}>
                {inner}
              </Card>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
