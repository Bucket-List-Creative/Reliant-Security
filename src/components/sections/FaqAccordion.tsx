import { Container } from "@/components/ui/Container";
import { Accordion } from "@/components/ui/Accordion";
import type { Faq } from "@/sanity/lib/types";

const FALLBACK: Faq[] = [
  {
    _id: "q1",
    question: "How fast is your monitoring response?",
    answer:
      "Our monitoring center operates 24/7 with an average verified response time of under a minute. Alarms are assessed and dispatched immediately.",
  },
  {
    _id: "q2",
    question: "Do I need to sign a long contract?",
    answer:
      "No. We offer flexible month-to-month monitoring alongside longer plans. You choose what fits your situation.",
  },
  {
    _id: "q3",
    question: "Can I keep my existing equipment?",
    answer:
      "In many cases, yes. During your free assessment we audit current hardware and recommend what to reuse versus upgrade.",
  },
];

export function FaqAccordion({
  faqs,
  heading = "Frequently asked questions",
}: {
  faqs?: Faq[];
  heading?: string;
}) {
  const items = faqs?.length ? faqs : FALLBACK;

  return (
    <section className="sfc-section" id="faq">
      <Container>
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-10 text-3xl font-bold sm:text-4xl">{heading}</h2>
          <Accordion
            items={items.map((f) => ({
              id: f._id,
              question: f.question,
              answer: f.answer,
            }))}
          />
        </div>
      </Container>
    </section>
  );
}
