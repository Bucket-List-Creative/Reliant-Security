import { IconStarFilled } from "@tabler/icons-react";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { SanityImage } from "@/components/ui/SanityImage";
import type { Testimonial } from "@/sanity/lib/types";

/**
 * ⚠️ PLACEHOLDER TESTIMONIALS — DO NOT LAUNCH WITH THESE.
 *
 * None of these are real Reliant customers. They exist only so the section
 * has shape during design review. Replace them with genuine Google and Angi
 * reviews (as `testimonial` documents in Sanity) before the site goes live —
 * publishing invented customer quotes is both misleading and, for reviews,
 * legally risky.
 *
 * The previous version attributed quotes to named people in Austin and
 * Denver, which is doubly wrong for a St. Louis-area company. Names and
 * locations have been stripped back so nothing here reads as a real,
 * verifiable reference.
 */
const FALLBACK: Testimonial[] = [
  {
    _id: "t1",
    quote:
      "The install was spotless and the monitoring team caught an issue before we even noticed. Genuinely reassuring.",
    authorName: "Sample review",
    authorRole: "Residential customer — replace with a real Google review",
    rating: 5,
  },
  {
    _id: "t2",
    quote:
      "They handled the cameras, the access control, and all the cabling. One team, one point of contact, no finger-pointing.",
    authorName: "Sample review",
    authorRole: "Commercial customer — replace with a real Google review",
    rating: 5,
  },
  {
    _id: "t3",
    quote:
      "They understood what a plant environment does to equipment and specified accordingly. It's held up.",
    authorName: "Sample review",
    authorRole: "Industrial customer — replace with a real Angi review",
    rating: 5,
  },
];

function Stars({ rating = 5 }: { rating?: number }) {
  return (
    <div
      className="mb-4 flex gap-0.5"
      aria-label={`${rating} out of 5 stars`}
      role="img"
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <IconStarFilled
          key={i}
          size={16}
          className={i < rating ? "text-white" : "text-white/30"}
        />
      ))}
    </div>
  );
}

export function Testimonials({
  testimonials,
  heading = "Trusted by homes and businesses",
}: {
  testimonials?: Testimonial[];
  heading?: string;
}) {
  const items = testimonials?.length ? testimonials : FALLBACK;

  return (
    <section className="sfc-section" id="testimonials">
      <Container>
        <h2 className="mb-12 max-w-2xl text-3xl font-bold sm:text-4xl">
          {heading}
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((t) => (
            <Card
              key={t._id}
              className="sfc-card--solid relative flex h-full flex-col"
            >
              {/* Oversized quote mark, in white at low opacity so it reads as
                  relief on the green rather than as a second colour. */}
              <span
                aria-hidden
                className="pointer-events-none absolute right-5 top-2 select-none font-display text-[5rem] leading-none text-white/15"
              >
                &rdquo;
              </span>
              <Stars rating={t.rating ?? 5} />
              <blockquote className="relative flex-1 text-lg leading-relaxed">
                “{t.quote}”
              </blockquote>
              <div className="mt-6 flex items-center gap-3">
                {t.avatar?.asset && (
                  <SanityImage
                    value={t.avatar}
                    width={48}
                    height={48}
                    className="size-12 rounded-full object-cover"
                  />
                )}
                <div>
                  <div className="font-semibold text-white">{t.authorName}</div>
                  {t.authorRole && (
                    <div className="text-sm text-white/65">{t.authorRole}</div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
