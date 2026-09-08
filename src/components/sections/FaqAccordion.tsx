import { Container } from "@/components/ui/Container";
import { Accordion } from "@/components/ui/Accordion";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { HOME_FAQS, type WebsiteFaq } from "@/content/faqs";

export function FaqAccordion({
  faqs = HOME_FAQS,
  heading = "Reliant FAQs",
  ctaLabel,
  showServiceLink = false,
}: {
  faqs?: WebsiteFaq[];
  heading?: string;
  ctaLabel?: string;
  showServiceLink?: boolean;
}) {
  if (!faqs.length) return null;
  const items = faqs;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  return (
    <section className="sfc-section" id="faq">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <Container>
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-10 text-3xl font-bold sm:text-4xl">{heading}</h2>
          <Accordion
            items={items.map((f, i) => ({
              id: `faq-${i}`,
              question: f.question,
              answer: f.answer,
            }))}
          />
          {showServiceLink && (
            <p className="mt-6 text-sm text-n-700">
              Explore <Link href="/services" className="text-brand-press hover:underline">our services</Link> for
              system-specific questions, or <Link href="/contact#faq" className="text-brand-press hover:underline">contact FAQs</Link> for
              service areas and consultations.
            </p>
          )}
          {ctaLabel && (
            <Button href="/contact" className="mt-6">{ctaLabel}</Button>
          )}
        </div>
      </Container>
    </section>
  );
}
