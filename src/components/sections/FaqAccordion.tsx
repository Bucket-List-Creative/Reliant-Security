import { Container } from "@/components/ui/Container";
import { Accordion } from "@/components/ui/Accordion";
import type { Faq } from "@/sanity/lib/types";

const FALLBACK: Faq[] = [
  {
    _id: "q1",
    question: "How fast is your monitoring response?",
    answer:
      "Reliant customers are backed by the Becklar professional monitoring network, which averages a 9.4-second response time across six interconnected, UL-certified monitoring stations in North America. Signals are assessed and dispatched around the clock, every day of the year.",
  },
  {
    _id: "q2",
    question: "Does Reliant offer 24/7 emergency service or technical support?",
    answer:
      "What runs 24/7 is professional monitoring — your alarm, smoke, and carbon-monoxide signals are watched and dispatched at any hour. Service calls and technical support are handled during regular business hours, and we schedule urgent service as quickly as we can.",
  },
  {
    _id: "q3",
    question: "Do I need to sign a contract?",
    answer:
      "Monitored plans typically start with a 36-month monitoring agreement, which is what keeps the monthly rate where it is. Month-to-month options are available in certain situations — tell us about your project and we'll lay out the choices before you commit.",
  },
  {
    _id: "q4",
    question: "Do you only work on homes, or commercial projects too?",
    answer:
      "Both. Reliant runs everything from single-family alarm systems to large commercial, industrial, and government projects — including video surveillance, access control, structured cabling and fiber, and audio/video. The same local team handles all of it.",
  },
  {
    _id: "q5",
    question: "Can I keep my existing equipment?",
    answer:
      "In many cases, yes. During your free assessment we audit the current hardware and recommend what's worth reusing versus replacing, rather than defaulting to a full rip-and-replace.",
  },
  {
    _id: "q6",
    question: "Are you tied to one manufacturer?",
    answer:
      "No. Reliant isn't locked into a single manufacturer or proprietary platform, so we design around what the site actually needs — including NDAA/TAA-compliant equipment when a project requires it.",
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
