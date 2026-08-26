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
    iconKey: "shield-check",
    title: "Alarm Systems",
    summary:
      "Intrusion, smoke, and carbon-monoxide detection for homes and businesses, backed by 24/7 professional monitoring.",
  },
  {
    _id: "f2",
    iconKey: "cctv",
    title: "Video Surveillance",
    summary:
      "Hardwired and wireless cameras — from a doorbell camera to site-wide industrial coverage — with recording you can review anywhere.",
  },
  {
    _id: "f3",
    iconKey: "key",
    title: "Access Control",
    summary:
      "Keyless entry, mobile credentials, and role-based permissions with a full audit trail on every door.",
  },
  {
    _id: "f4",
    iconKey: "network",
    title: "Structured Cabling & Fiber",
    summary:
      "Cat6/Cat6A, fiber, racks, and pathways — certified, labeled, and documented network infrastructure.",
  },
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
          {items.map((service) => {
            const inner = (
              <>
                <div className="flex items-center gap-4">
                  <CardIcon>
                    <ServiceIcon
                      name={
                        isServiceIconKey(service.iconKey)
                          ? service.iconKey
                          : "shield-check"
                      }
                      size={26}
                    />
                  </CardIcon>
                  <h3 className="text-lg font-semibold leading-snug">
                    {service.title}
                  </h3>
                </div>
                <p className="mt-4 flex-1 text-[0.9rem] leading-relaxed">
                  {service.summary}
                </p>
              </>
            );

            const slug = "slug" in service ? service.slug : undefined;
            const cardClass = "sfc-card--solid flex h-full flex-col";

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
