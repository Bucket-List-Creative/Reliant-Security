import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export function CtaBanner({
  heading = "Get a same-day quote",
  subheading = "Tell us about your project and we'll put together a detailed proposal. No obligation, no pressure — just a straight answer on what it will cost.",
  phone,
}: {
  heading?: string;
  subheading?: string;
  phone?: string;
}) {
  return (
    <section className="sfc-section">
      <Container>
        <div
          className="rounded-[var(--radius-xl)] bg-surface-raised px-8 py-14 text-center"
          style={{ boxShadow: "var(--shadow-soft-4)" }}
        >
          <h2 className="mx-auto max-w-2xl text-3xl font-bold sm:text-4xl">
            {heading}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-n-700">
            {subheading}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href="/contact" variant="primary">
              Get a Same-Day Quote
            </Button>
            {phone && (
              <Button href={`tel:${phone}`} variant="outline">
                Call {phone}
              </Button>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
