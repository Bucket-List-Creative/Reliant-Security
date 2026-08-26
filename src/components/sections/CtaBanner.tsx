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
        {/* Dark band, matching the stat bar — the page opens and closes on the
            brand colour, with the pale card sections between them. */}
        <div
          className="sfc-band px-6 py-14 text-center sm:px-8 sm:py-16"
          style={{ boxShadow: "var(--shadow-overlay)" }}
        >
          <h2 className="mx-auto max-w-2xl text-3xl font-bold sm:text-4xl">
            {heading}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">
            {subheading}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href="/contact" variant="cta">
              Get a Same-Day Quote
            </Button>
            {phone && (
              <a
                href={`tel:${phone}`}
                className="sfc-btn border-white/35 bg-transparent text-white hover:bg-white/10"
                style={{ boxShadow: "none" }}
              >
                Call {phone}
              </a>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
