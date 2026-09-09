import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { HOME_DEFAULTS } from "@/content/pages";

type Props = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
};

export function Hero({
  // "24/7" attaches to professional monitoring, never to service or support —
  // Reliant does not offer round-the-clock emergency service or a 24/7 help
  // desk, and the wording must not imply otherwise. The defaults live in
  // `content/pages` so the Studio can be seeded with the same words.
  eyebrow = HOME_DEFAULTS.hero.eyebrow,
  title = HOME_DEFAULTS.hero.title,
  subtitle = HOME_DEFAULTS.hero.subtitle,
  primaryCta = HOME_DEFAULTS.hero.primaryCta,
  secondaryCta = HOME_DEFAULTS.hero.secondaryCta,
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
