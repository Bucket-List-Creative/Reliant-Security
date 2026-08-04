import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

/** Branded 404 body, shared by the root and (site) not-found boundaries. */
export function NotFoundContent() {
  return (
    <section className="sfc-section flex flex-1 items-center pt-16">
      <Container>
        <Card className="mx-auto max-w-xl text-center">
          <div className="sfc-card__icon mx-auto text-2xl">🔍</div>
          <p className="mt-6 font-mono text-sm font-semibold tracking-widest text-brand-press">
            ERROR 404
          </p>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
            We couldn&apos;t find that page
          </h1>
          <p className="mx-auto mt-4 max-w-md text-n-700">
            The page you&apos;re looking for may have moved or never existed.
            Let&apos;s get you back to safety.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href="/" variant="primary">
              Back to home
            </Button>
            <Button href="/contact" variant="outline">
              Contact us
            </Button>
          </div>
        </Card>
      </Container>
    </section>
  );
}
