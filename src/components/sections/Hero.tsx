import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

type Props = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
};

export function Hero({
  eyebrow = "Trusted protection, 24/7",
  title = "Security that feels effortless.",
  subtitle = "Reliant Security designs, installs, and monitors premium systems for homes and businesses — with rapid response you can count on.",
  primaryCta = { label: "Get a Same-Day Quote", href: "/contact" },
  secondaryCta = { label: "Explore services", href: "/services" },
}: Props) {
  return (
    <section className="sfc-section pt-12">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <Badge className="mb-6">
            <span aria-hidden>●</span> {eyebrow}
          </Badge>
          <h1 className="text-4xl font-bold leading-[1.05] sm:text-5xl md:text-6xl">
            {title}
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-n-700">{subtitle}</p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href={primaryCta.href} variant="primary">
              {primaryCta.label}
            </Button>
            <Button href={secondaryCta.href} variant="outline">
              {secondaryCta.label}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
