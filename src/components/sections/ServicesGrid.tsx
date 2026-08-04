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
    title: "Home Security",
    summary:
      "Smart alarms, door and window sensors, and 24/7 monitoring tailored to your home.",
  },
  {
    _id: "f2",
    icon: "📹",
    title: "Video Surveillance",
    summary:
      "HD cameras with intelligent motion detection and cloud recording you can review anywhere.",
  },
  {
    _id: "f3",
    icon: "🔐",
    title: "Access Control",
    summary:
      "Keyless entry, smart locks, and permission management for homes and businesses.",
  },
  {
    _id: "f4",
    icon: "🚨",
    title: "Rapid Response",
    summary:
      "Round-the-clock monitoring with fast dispatch when every second counts.",
  },
];

export function ServicesGrid({
  services,
  heading = "What we protect",
  subheading = "End-to-end security, designed around how you actually live and work.",
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

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((service) => {
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
                <p className="mt-2 text-n-700">{service.summary}</p>
              </>
            );

            const slug = "slug" in service ? service.slug : undefined;

            return showLinks && slug ? (
              <Link
                key={service._id}
                href={`/services/${slug}`}
                className="block"
              >
                <Card interactive className="h-full">
                  {inner}
                </Card>
              </Link>
            ) : (
              <Card key={service._id} interactive className="h-full">
                {inner}
              </Card>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
