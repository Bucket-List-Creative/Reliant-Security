import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Card, CardIcon } from "@/components/ui/Card";
import { ServiceIcon, type ServiceIconKey } from "@/components/ui/ServiceIcon";

/**
 * "Who we are / what we do" — sits high on the home page so a visitor sees the
 * full scope of Reliant immediately.
 *
 * This section exists specifically to stop the site reading as residential-
 * only. Keep commercial, industrial, government, cabling/fiber, and AV on it:
 * dropping any of them re-introduces exactly the problem it was added to fix.
 */
type Capability = {
  title: string;
  description: string;
  iconKey: ServiceIconKey;
  href: string;
};

const CAPABILITIES: Capability[] = [
  {
    title: "Residential Security",
    description:
      "Monitored alarms, cameras, and smart control for single-family homes, custom homes, and multi-family properties.",
    iconKey: "home",
    href: "/industries?segment=residential",
  },
  {
    title: "Commercial Security",
    description:
      "Offices, retail, healthcare, and warehousing — systems designed around how the building is actually used.",
    iconKey: "building",
    href: "/industries?segment=commercial",
  },
  {
    title: "Industrial & Government",
    description:
      "Large plants, manufacturing sites, and Federal, State, Municipal, and DoD facilities — including NDAA/TAA-compliant equipment.",
    iconKey: "factory",
    href: "/industries?segment=industrial",
  },
  {
    title: "Video Surveillance",
    description:
      "Hardwired and wireless camera systems, from a single doorbell to site-wide industrial coverage.",
    iconKey: "cctv",
    href: "/services/cctv-surveillance",
  },
  {
    title: "Access Control",
    description:
      "Keyless entry, mobile credentials, role-based permissions, and a full audit trail on every door.",
    iconKey: "key",
    href: "/services/access-control",
  },
  {
    title: "Structured Cabling & Fiber",
    description:
      "Cat6/Cat6A, fiber, racks, and pathways — certified, labeled, and documented infrastructure.",
    iconKey: "network",
    href: "/services/network-cabling",
  },
  {
    title: "Audio/Video",
    description:
      "Distributed audio, displays, and conference-room AV for homes and businesses alike.",
    iconKey: "speaker",
    href: "/services/audio-video",
  },
  {
    title: "24/7 Professional Monitoring",
    description:
      "UL-certified central-station monitoring for intrusion, smoke, and carbon monoxide, every hour of the year.",
    iconKey: "shield-check",
    href: "/pricing",
  },
];

export function CapabilitiesGrid() {
  return (
    <section className="sfc-section" id="what-we-do">
      <Container>
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">
            One local team, from a single home to a full industrial site
          </h2>
          <p className="mt-4 text-lg text-n-700">
            Reliant Security is a locally owned security and low-voltage
            integrator. We design, install, and service everything below — so
            whether you need an alarm on a house or surveillance, access
            control, and fiber across a manufacturing plant, it&apos;s the same
            team and the same standard.
          </p>
        </div>

        {/* Centred cards: an eight-up symmetric grid reads better centred than
            left-aligned, where eight ragged text blocks fight each other. */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CAPABILITIES.map((c) => (
            <Link key={c.title} href={c.href} className="block">
              <Card
                interactive
                className="sfc-card--tint flex h-full flex-col items-center text-center"
              >
                <CardIcon>
                  <ServiceIcon name={c.iconKey} size={26} />
                </CardIcon>
                <h3 className="mt-5 text-[1.05rem] font-semibold leading-snug">
                  {c.title}
                </h3>
                <p className="mt-2.5 flex-1 text-[0.9rem] leading-relaxed">
                  {c.description}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
